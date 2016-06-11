
import React, { PropTypes, Component } from 'react';
import Style from '../../../shared/style';
import * as actions from '../../actions/main-actions';

let cachedResults = { };
try {
  cachedResults = require('./cachedSearchData').default;
} catch (e) { console.log(e); }

const Bing = require('node-bing-api')({
  accKey: 'u77loLpd/+Z6fYpjJSB6BHOYf0tbE+s0IFgQJTmwFug',
  rootUri: 'https://api.datamarket.azure.com/Bing/SearchWeb/v1/',
});

const SIDEBAR_STYLE = Style.registerStyle({
  width: '300px',
  flexDirection: 'column',
  overflow: 'auto',
  borderRight: 'solid 1px rgba(128, 128, 128, .5)',
});

const RESULT_TYPE_CONTAINER_STYLE = Style.registerStyle({
  flexShrink: 0,
});

const RESULT_TYPE_STYLE = Style.registerStyle({
  background: '#ddd',
  flex: 1,
  textAlign: 'center',
  display: 'inline-block',
  margin: '0 auto',
  padding: '10px',
  cursor: 'pointer',
});

const RESULT_LIST_STYLE = Style.registerStyle({
  flexDirection: 'column',
  flexShrink: 0,
});

const RESULT_CONTAINER_STYLE = Style.registerStyle({
  flexDirection: 'column',
  flexShrink: 0,
});

const RESULT_MESSAGE_STYLE = Style.registerStyle({
  alignSelf: 'center',
  paddingTop: 10,
  lineHeight: 1,
});

const RESULT_HEADER_STYLE = Style.registerStyle({
  margin: '5px 0 0 0',
});

const Sidebar = React.createClass({
  displayName: 'Sidebar',
  getInitialState() {
    return {
      location: null,
      latitude: null,
      longitude: null,
      fetchingInboundResults: false,
      fetchingNearbyResults: false,
      showInbound: true,
      inboundLinkResults: [],
      nearbyResults: [],
    };
  },
  componentDidMount() {
    // console.log("componentDidMount", this.props.page.location);
    const loc = this.fixURL(this.props.page.location);
    this.fetchResults(loc);
    this.setState({
      location: loc,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showInbound && !this.state.showInbound) {
      this.fetchLocalResults();
    }
  },

  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps", this.props.page.location, this.state.location, nextProps.page.location);
    const loc = this.fixURL(nextProps.page.location);
    if (loc !== this.state.location) {
      this.fetchResults(loc);
      this.refs.container.scrollTop = 0;
    }

    this.setState({
      location: loc,
    });
  },

  // Return a URL but without query string, hash, etc.
  fixURL(url) {
    try {
      const parsed = require("url").parse(url);
      const search = parsed.search || "";
      return parsed.protocol + "//" + parsed.host + parsed.pathname + search;
    } catch (e) {
      return url;
    }
  },

  formatResult(result) {
    return {
      Description: result.Description,
      DisplayUrl: result.DisplayUrl,
      Url: result.Url,
      Title: result.Title,
    };
  },

  async fetchResults(loc) {
    let inboundLinkResults = cachedResults[loc];
    if (!inboundLinkResults) {
      this.setState({
        fetchingInboundResults: true,
      });
      inboundLinkResults = await this.fetchInboundResults(loc);
      this.setState({
        fetchingInboundResults: false,
      });
      cachedResults[loc] = inboundLinkResults;
      console.log("fresh fetchResults complete for " + loc, cachedResults);
    } else {
      console.log("cached fetchResults complete for " + loc, cachedResults);
    }

    // Prevent exact matches to this page.
    inboundLinkResults = inboundLinkResults.filter(result => {
      return result.Url !== loc;
    });

    this.setState({
      inboundLinkResults,
    });
  },

  getGeolocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        try {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        } catch (e) {
          reject();
        }
      }, reject);
    });
  },

  fetch(url) {
    return new Promise((resolve, reject) => {
      const request = require('request');
      request(url, (error, response, body) => {
        if (error) {
          reject();
        } else {
          resolve(body);
        }
      });
    });
  },

  async fetchLocalResults() {
    try {
      this.setState({
        fetchingNearbyResults: true,
      });
      const { latitude, longitude } = await this.getGeolocation();
      const body = await this.fetch(`https://api.foursquare.com/v2/venues/search?ll=${latitude},${longitude}&oauth_token=1RMB3OQH1I0KIDBSK2ALPPVABKYM3UZMSNO1XCQAFYUZKUS3&v=20151119`);
      const nearbyResults = JSON.parse(body).response.venues.map(venue => {
        return {
          Title: venue.name,
          Categories: venue.categories.map(c => c.name).join(','),
          Description: venue.location.formattedAddress.join('\n'),
          Url: venue.url,
        };
      });

      this.setState({ nearbyResults, latitude, longitude });
    } catch (e) { console.log('Error fetching local results', e); }

    this.setState({
      fetchingNearbyResults: false,
    });
  },

  // XXX: Move this out of node and into the profile service
  fetchInboundResults(loc) {
    return new Promise(resolve => {
      Bing.web(`"${loc}"`, {
        top: 50,  // Number of results (max 50)
        // skip: 0,   // Skip first N results
        adult: 'Strict',
        // options: ['DisableLocationDetection'],
      }, (error, res, body) => {
        if (error || !body.d) {
          console.log('Error', error, body);
          resolve(null);
        }
        resolve(body.d.results.map(this.formatResult));
      });
    });
  },

  handleClick(e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { // XXX: Be better about this
      this.props.dispatch(actions.createTab(e.target.href, this.props.page.sessionId, {
        selected: false,
      }));
    } else {
      this.props.setLocation(e.target.href);
    }
  },

  renderInboundResult(result) {
    return (<div className={RESULT_CONTAINER_STYLE}>
      <h2 className={RESULT_HEADER_STYLE}>
        <a onClick={this.handleClick}
          href={result.Url}
          title={result.Title}>{result.Title.substring(0, 80)}</a>
      </h2>
      <cite>{result.DisplayUrl}</cite>
      <div>
        {result.Description}
      </div>
    </div>);
  },

  renderLocalResult(result) {
    return (<div className={RESULT_CONTAINER_STYLE}>
      <h2 className={RESULT_HEADER_STYLE}>
        { result.Url ? (
          <a onClick={this.handleClick}
            href={result.Url}
            title={result.Title}>{result.Title.substring(0, 80)}</a>
        ) : (
          <span>{result.Title}>{result.Title.substring(0, 80)}</span>
        )}
      </h2>
      <cite>{result.Categories}</cite>
      <div>
        {result.Description}
      </div>
    </div>);
  },

  render() {
    let allInboundResults = [];
    let inboundMessage = null;
    if (this.state.fetchingInboundResults) {
      inboundMessage = (<div className={RESULT_MESSAGE_STYLE}>Searching the web
        &nbsp;<i className="fa fa-spinner fa-pulse" /></div>);
    } else if (!this.state.inboundLinkResults.length) {
      inboundMessage = (<div className={RESULT_MESSAGE_STYLE}>Nothing to show</div>);
    } else {
      allInboundResults = this.state.inboundLinkResults.map(r => this.renderInboundResult(r));
    }

    let allSimilarResults = [];
    let similarMessage = null;
    if (this.state.fetchingNearbyResults) {
      similarMessage = (<div className={RESULT_MESSAGE_STYLE}>Searching for location
        &nbsp;<i className="fa fa-spinner fa-pulse" /></div>);
    } else if (!this.state.nearbyResults.length) {
      similarMessage = (<div className={RESULT_MESSAGE_STYLE}>Nothing to show</div>);
    } else {
      allSimilarResults = this.state.nearbyResults.map(r => this.renderLocalResult(r));
    }

    return (
      <div
        ref="container"
        className={SIDEBAR_STYLE}>
        <div className={RESULT_TYPE_CONTAINER_STYLE}>
          <h3 className={RESULT_TYPE_STYLE}
            title={`Showing results for ${this.state.location}`}
            style={this.state.showInbound ? { background: 'orangered' } : null}
            onClick={() => { this.setState({ showInbound: true }); }}>
          Links to this</h3>
          <h3 className={RESULT_TYPE_STYLE}
            title={this.state.latitude ? `Location ${this.state.latitude} ${this.state.longitude}` : null}
            style={!this.state.showInbound ? { background: 'orangered' } : null}
            onClick={() => { this.setState({ showInbound: false }); }}>
          Nearby places</h3>
        </div>
        <div className={RESULT_LIST_STYLE}
          hidden={!this.state.showInbound}>
          {inboundMessage}
          {allInboundResults}
        </div>
        <div className={RESULT_LIST_STYLE}
          hidden={this.state.showInbound}>
          {similarMessage}
          {allSimilarResults}
        </div>
      </div>
    );
  },
});

Sidebar.propTypes = {
  webViewController: PropTypes.object.isRequired,
  props: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
};

export default Sidebar;

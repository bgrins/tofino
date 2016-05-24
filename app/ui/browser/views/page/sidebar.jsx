
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
      fetchingResults: false,
      showInbound: true,
      inboundLinkResults: [],
      similarResults: [],
    };
  },
  componentDidMount() {
    // console.log("componentDidMount", this.props.page.location);
    this.fetchResults(this.props.page.location);
  },

  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps", this.props.page.location, this.state.location, nextProps.page.location);
    let loc = this.fixURL(nextProps.page.location);
    if (loc !== this.state.location) {
      this.setState({
        location: loc,
      });
      this.fetchResults(loc);
      this.refs.container.scrollTop = 0;
    }
  },

  // Return a URL but without query string, hash, etc.
  fixURL(url) {
    try {
      const parsed = require("url").parse(url);
      return parsed.protocol + "//" + parsed.host + parsed.pathname;
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
    // XXX: Using dummy data for now
    // setTimeout(() => {
    //   this.setState({
    //     location: loc,
    //     inboundLinkResults: SAMPLE_RESPONSE.d.results.map(this.formatResult).filter(() => Math.random() > .5),
    //     similarResults: SAMPLE_RESPONSE.d.results.map(this.formatResult).filter(() => Math.random() > .5),
    //   });
    // }, 0);
    // return;
    let inboundLinkResults = cachedResults[loc];
    if (!inboundLinkResults) {
      this.setState({
        fetchingResults: true,
      });
      inboundLinkResults = await this.fetchInboundResults(loc);
      this.setState({
        fetchingResults: false,
      });
      cachedResults[loc] = inboundLinkResults;
      console.log("fresh fetchResults complete for " + loc, cachedResults);
    } else {
      console.log("cached fetchResults complete for " + loc, cachedResults);
    }

    // if (!inboundLinkResults || !inboundLinkResults.length) {
    //   return;
    // }
    this.setState({
      inboundLinkResults,
    });
  },

  // XXX: Move this out of node and into the profile service
  fetchInboundResults(loc) {
    return new Promise(resolve => {
      Bing.web(`"${loc}"`, {
        top: 15,  // Number of results (max 50)
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

  renderResult(result) {
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

  render() {
    let allInboundResults = [];
    const allSimilarResults = this.state.similarResults.map(r => this.renderResult(r));
    let inboundMessage = null;
    if (this.state.fetchingResults) {
      inboundMessage = (<div className={RESULT_MESSAGE_STYLE}>Searching the web
        &nbsp;<i className="fa fa-spinner fa-pulse" /></div>);
    } else if (!this.state.inboundLinkResults.length) {
      inboundMessage = (<div className={RESULT_MESSAGE_STYLE}>Nothing to show</div>);
    } else {
      allInboundResults = this.state.inboundLinkResults.map(r => this.renderResult(r));
    }
    return (
      <div
        ref="container"
        className={SIDEBAR_STYLE}>
        <div className={RESULT_TYPE_CONTAINER_STYLE}>
          <h3 className={RESULT_TYPE_STYLE}
            style={this.state.showInbound ? { background: 'orangered' } : null}
            onClick={() => { this.setState({ showInbound: true }); }}>
          Links to this</h3>
          <h3 className={RESULT_TYPE_STYLE}
            style={!this.state.showInbound ? { background: 'orangered' } : null}
            onClick={() => { this.setState({ showInbound: false }); }}>
          Similar content</h3>
        </div>
        <div className={RESULT_LIST_STYLE}
          hidden={!this.state.showInbound}>
          {inboundMessage}
          {allInboundResults}
        </div>
        <div className={RESULT_LIST_STYLE}
          hidden={this.state.showInbound}>
        {allSimilarResults.length ? allSimilarResults : 'Nothing to show'}
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

const SAMPLE_RESPONSE = {
  "d": {
    "results": [
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=0&$top=1",
          "type": "WebResult"
        },
        "ID": "015388ed-f911-4282-a9c2-33ec475adf6d",
        "Title": "World News - CNN.com",
        "Description": "View CNN world news today for international news and videos from Europe, Asia, Africa, the Middle East and the Americas.",
        "DisplayUrl": "www.cnn.com/WORLD",
        "Url": "http://www.cnn.com/WORLD/"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=1&$top=1",
          "type": "WebResult"
        },
        "ID": "3c986c8b-a43c-400b-90eb-6d575b97f562",
        "Title": "CNN - Breaking News, U.S., World, Weather, Entertainment ...",
        "Description": "Find the latest breaking news and information on the top stories, weather, business, entertainment, politics, and more. For in-depth coverage, CNN provides special ...",
        "DisplayUrl": "edition.cnn.com",
        "Url": "http://edition.cnn.com/"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=2&$top=1",
          "type": "WebResult"
        },
        "ID": "a42d4312-e98c-46b5-802e-d8e26bb75485",
        "Title": "CNN | All Free Word Games",
        "Description": "Access free word games here at CNN. Offering the best word games for free and online.",
        "DisplayUrl": "games.cnn.com/word-games",
        "Url": "http://games.cnn.com/word-games"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=3&$top=1",
          "type": "WebResult"
        },
        "ID": "29ca2585-100d-4b7f-bfed-19c7c177b5f8",
        "Title": "Middle East: News & Videos about Middle East -- CNN.com",
        "Description": "A stream of the most recent articles and videos published by CNN, updated every time you reload this page.",
        "DisplayUrl": "edition.cnn.com/WORLD/meast/archive",
        "Url": "http://edition.cnn.com/WORLD/meast/archive/"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=4&$top=1",
          "type": "WebResult"
        },
        "ID": "43674e62-0b87-4164-aa7c-444a93b73738",
        "Title": "Crossword Puzzles : CNN",
        "Description": "Play Crossword Puzzles instantly online. Crossword Puzzles is a fun and engaging online game from CNN. Play it and other CNN games online.",
        "DisplayUrl": "games.cnn.com/games/crossword-puzzles",
        "Url": "http://games.cnn.com/games/crossword-puzzles/"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=5&$top=1",
          "type": "WebResult"
        },
        "ID": "02c81732-4999-4fcd-ada4-b0267d536a9b",
        "Title": "CNN.com - World",
        "Description": "CNN.com delivers up-to-the-minute news and information on the latest top stories, weather, entertainment, politics and more.",
        "DisplayUrl": "rss.cnn.com/rss/cnn_world.rss",
        "Url": "http://rss.cnn.com/rss/cnn_world.rss"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=6&$top=1",
          "type": "WebResult"
        },
        "ID": "432d3fd5-ea11-44c9-b994-db93a3216be3",
        "Title": "Egypt – This Just In - CNN.com Blogs",
        "Description": "... 4:19 a.m. in Egypt] CNN's Ben Wedeman, ... Looking for the freshest news from CNN? Go to our ever-popular CNN.com homepage on your desktop or your mobile device, ...",
        "DisplayUrl": "news.blogs.cnn.com/category/world/egypt-world-latest-news",
        "Url": "http://news.blogs.cnn.com/category/world/egypt-world-latest-news/"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=7&$top=1",
          "type": "WebResult"
        },
        "ID": "70a03182-5cdc-4091-880b-fa5931235e43",
        "Title": "CNN.co.jp : World",
        "Description": "CNN.co.jp App for iPhone/iPad; CNN ...",
        "DisplayUrl": "www.cnn.co.jp/world",
        "Url": "http://www.cnn.co.jp/world/"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=8&$top=1",
          "type": "WebResult"
        },
        "ID": "74c3ab5f-5333-432d-8110-7a3afcf7cb54",
        "Title": "Weather forecast - CNN.com",
        "Description": "Local weather forecast and maps for Atlanta, GA (30303). Get current conditions & 5-day forecasts plus radar, satellite, and temperature maps.",
        "DisplayUrl": "weather.cnn.com/weather/forecast.jsp",
        "Url": "http://weather.cnn.com/weather/forecast.jsp"
      },
      {
        "__metadata": {
          "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='\"http://cnn.com\"'&Options='DisableLocationDetection'&Adult='Strict'&$skip=9&$top=1",
          "type": "WebResult"
        },
        "ID": "6bf1a7b3-4597-4103-a117-a909d5729b1b",
        "Title": "CNN Impact Your World",
        "Description": "CNN Impact Your World. 13,884 likes · 340 talking about this. TAKE ACTION - Be part of the solution. Get informed, connect to organizations and share how...",
        "DisplayUrl": "https://www.facebook.com/ImpactYourWorld",
        "Url": "https://www.facebook.com/ImpactYourWorld"
      }
    ],
    "__next": "https://api.datamarket.azure.com/Data.ashx/Bing/SearchWeb/v1/Web?Query='%22http://cnn.com%22'&Options='DisableLocationDetection'&Adult='Strict'&$skip=10&$top=10"
  }
};

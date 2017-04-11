/*
Copyright 2016 Mozilla

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

import React, { PureComponent, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';

import WebContentsActions from '../../../actions/webcontents-actions';
import * as Meta from '../../../constants/meta';

import Styles from './page.css';
import WebContents from '../../../../shared/widgets/web-contents';
import WebView from '../../../../shared/widgets/web-contents/webview';
import IframeDummyBrowser from '../../../../shared/widgets/web-contents/iframe-dummy-browser';
import IframeMozBrowser from '../../../../shared/widgets/web-contents/iframe-mozbrowser';

@connect(() => ({
  platform: Meta.PLATFORM,
}))
@CSSModules(Styles, {
  allowMultiple: true,
})
export default class Page extends PureComponent {
  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    this.props.dispatch(WebContentsActions.events.pageDidMount({ pageId: this.props.pageId }));
  }

  setWebContentsRef = (e) => {
    this._webContents = e;
  }

  handleDidStartLoading = () => {
    this.props.dispatch(WebContentsActions.events.pageDidStartLoading({ pageId: this.props.pageId }));
  }

  handleDidStopLoading = () => {
    this.props.dispatch(WebContentsActions.events.pageDidStopLoading({ pageId: this.props.pageId }));
  }

  handleDidSucceedLoad = () => {
    this.props.dispatch(WebContentsActions.events.pageDidSucceedLoad({ pageId: this.props.pageId }));
  }

  handleDidFailLoad = () => {
    this.props.dispatch(WebContentsActions.events.pageDidFailLoad({ pageId: this.props.pageId }));
  }

  handlePageTitleSet = ({ title }) => {
    this.props.dispatch(WebContentsActions.events.pageTitleSet({ pageId: this.props.pageId, title }));
  }

  handlePageFaviconSet = ({ favicon }) => {
    this.props.dispatch(WebContentsActions.events.pageFaviconSet({ pageId: this.props.pageId, favicon }));
  }

  handleDidNavigate = ({ url }) => {
    this.props.dispatch(WebContentsActions.events.pageDidNavigate({ pageId: this.props.pageId, url }));
  }

  handleDidNavigateInternal = () => {
    this.props.dispatch(WebContentsActions.events.pageDidNavigateInternal({ pageId: this.props.pageId }));
  }

  handleDidNavigateToNewWindow = () => {
    this.props.dispatch(WebContentsActions.events.pageDidNavigateToNewWindow({ pageId: this.props.pageId }));
  }

  render() {
    let impl;
    if (this.props.platform === 'electron') {
      impl = WebView;
    } else if (this.props.platform === 'dummy') {
      impl = IframeDummyBrowser;
    } else if (this.props.platform === 'qbrt') {
      impl = IframeMozBrowser;
    } else {
      throw new Error('Unknown browser runner platform.');
    }
    return (
      <WebContents
        impl={impl}
        id={this.props.pageId}
        ref={this.setWebContentsRef}
        styleName="page"
        onDidStartLoading={this.handleDidStartLoading}
        onDidStopLoading={this.handleDidStopLoading}
        onDidSucceedLoad={this.handleDidSucceedLoad}
        onDidFailLoad={this.handleDidFailLoad}
        onPageTitleSet={this.handlePageTitleSet}
        onPageFaviconSet={this.handlePageFaviconSet}
        onDidNavigate={this.handleDidNavigate}
        onDidNavigateInternal={this.handleDidNavigateInternal}
        onDidNavigateToNewWindow={this.handleDidNavigateToNewWindow}
      />
    );
  }
}

Page.WrappedComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
};

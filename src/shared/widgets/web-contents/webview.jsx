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

import React, { PureComponent } from 'react';

import WebContents from '.';

export default class WebView extends PureComponent {
  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    this._webview.addEventListener('did-start-loading', () => {
      this.props.onDidStartLoading();
    });
    this._webview.addEventListener('did-stop-loading', () => {
      this.props.onDidStopLoading();
    });
    this._webview.addEventListener('did-finish-load', () => {
      this.props.onDidSucceedLoad();
    });
    this._webview.addEventListener('did-fail-load', () => {
      this.props.onDidFailLoad();
    });
    this._webview.addEventListener('page-title-set', (e) => {
      this.props.onPageTitleSet({ title: e.title });
    });
    this._webview.addEventListener('page-favicon-updated', (e) => {
      this.props.onPageFaviconSet({ favicon: e.favicons[0] });
    });
    this._webview.addEventListener('did-navigate', (e) => {
      this.props.onDidNavigate({ url: e.url });
    });
    this._webview.addEventListener('did-navigate-in-page', () => {
      this.props.onDidNavigateInternal();
    });
    this._webview.addEventListener('new-window', () => {
      this.props.onDidNavigateToNewWindow();
    });
  }

  setWebViewRef = (e) => {
    this._webview = e;
  }

  navigateTo = (url) => {
    this._webview.setAttribute('src', url);
  }

  goBack = () => {
    this._webview.goBack();
  }

  goForward = () => {
    this._webview.goForward();
  }

  reload = () => {
    this._webview.reload();
  }

  render() {
    return (
      <webview
        is="webview"
        ref={this.setWebViewRef}
        class={this.props.className}
      />
    );
  }
}

WebView.propTypes = WebContents.implPropTypes;
WebView.defaultProps = WebContents.defaultProps;

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

export default class IframeDummyBrowser extends PureComponent {
  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    this._iframe.addEventListener('load', () => {
      this.props.onDidStopLoading();
      this.props.onPageTitleSet({ title: 'Loaded' });
    });
  }

  setIframeRef = (e) => {
    this._iframe = e;
  }

  navigateTo = (url) => {
    this._iframe.setAttribute('src', url);
  }

  goBack = () => {
    throw new Error('Not implemented.');
  }

  goForward = () => {
    throw new Error('Not implemented.');
  }

  reload = () => {
    throw new Error('Not implemented.');
  }

  render() {
    return (
      <iframe
        is="iframe"
        ref={this.setIframeRef}
        class={this.props.className}
        frameborder="0"
      />
    );
  }
}

IframeDummyBrowser.propTypes = WebContents.implPropTypes;
IframeDummyBrowser.defaultProps = WebContents.defaultProps;

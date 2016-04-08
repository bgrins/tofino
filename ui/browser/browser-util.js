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

import UrlUtil from '../shared/url-util';

/**
 * Given a search query, format it into a search engine's URL
 */
export function getSearchURL(query) {
  // See https://dxr.mozilla.org/mozilla-central/source/browser/locales/en-US/searchplugins
  // for a list of providers.
  return `https://www.google.com/search?ie=utf-8&oe=utf-8&q=${encodeURIComponent(query)}`;
}

/**
 * Convert whatever the user typed into the URL bar into an actual URL
 */
export function fixURL(typed) {
  if (UrlUtil.isDataUrl(typed)) {
    return typed;
  }

  if (typed.includes('://')) {
    return typed;
  }

  if (UrlUtil.isURL(typed) && !typed.includes(' ')) {
    return UrlUtil.getUrlFromInput(typed);
  }

  return getSearchURL(typed);
}

/**
 *
 */
export function getBestDropItem(dataTransfer) {
  let uriitem = null;
  let textitem = null;
  for (let i = 0; i < dataTransfer.items.length; i++) {
    const item = dataTransfer.items[i];
    if (item.type === 'application/vnd.mozilla.bh.page') {
      return item;
    }
    if (item.type === 'text/uri-list') {
      uriitem = item;
    }
    if (item.type === 'text/plain') {
      textitem = item;
    }
  }
  return uriitem || textitem;
}

/**
 *
 */
export function getCurrentWebView(document) {
  return document.querySelector('#browser-page.visible > web-view').webview;
}

/**
 *
 */
export function getWebView(document, pageIndex) {
  const element = document.querySelector(`web-view.webview-${pageIndex}`);
  if (element == null) {
    throw new Error(`No webview for pageIndex=${pageIndex}`);
  }
  return element.webview;
}

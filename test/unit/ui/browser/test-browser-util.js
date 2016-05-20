// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { fixURL, getSearchURL } from '../../../../app/ui/browser/browser-util';

describe('utils', () => {
  describe('fixURL', () => {
    it('should leave URLs unchanged', () => {
      const UNCHANGED_URLS = [
        'data:text/html,',
        'http://example.com',
        'http://foo.com',
        'https://foo.com',
        'https://foo.com/?a=%20b',
        'data:about',
        'view-source:http://foo.com/',
        'rtsp://100.100.100.100/rtsp.mp4',

        // @TODO Handle spaces in GET parameters
        // 'https://foo.com/?a= b',

        // @TODO url.parse is converting this to https://xn--e28h.com
        // 'https://😀.com',
      ];
      for (const url of UNCHANGED_URLS) {
        expect(fixURL(url)).toEqual(url);
      }
    });

    it('should append protocol onto URIs', () => {
      const CHANGED_URLS = [
        ['example.com', 'http://example.com'],
        ['example.net', 'http://example.net'],
        ['foo.bar', 'http://foo.bar'],
        ['blerg.co.uk', 'http://blerg.co.uk'],
        ['blach.com', 'http://blach.com'],
        ['www.blah.com', 'http://www.blah.com'],
        [' mozilla.org', 'http://mozilla.org'],
        ['mozilla.org ', 'http://mozilla.org'],
        ['mozilla.org/foobar', 'http://mozilla.org/foobar'],

        // @TODO: How should this input be handled?
        // ['https://foo', 'https://foo.com'],
        // ['http://foo', 'http://foo.com'],
      ];
      for (const [input, url] of CHANGED_URLS) {
        expect(fixURL(input)).toEqual(url);
      }
    });

    it('should use a search engine for queries', () => {
      const SEARCH_TERMS = [
        'data',
        'data:',
        'data: ',
        'view-source',
        'view-source:',
        'view-source: ',
        'fake-nested:http://foo.com',
        'search',
        'another search',
        'a ? b',
        'a . b ?',
        'what is mozilla',
        'what is mozilla?',
        'www.blah.com foo',
        'a?some b',
        'docshell site:mozilla.org',
        '?mozilla',
        '?site:mozilla.org docshell',
        'http:',
        'a?',
        'a?b',
      ];
      for (const input of SEARCH_TERMS) {
        expect(fixURL(input)).toEqual(getSearchURL(input));
      }
    });
  });
});

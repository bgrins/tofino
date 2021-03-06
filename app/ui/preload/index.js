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

import './context-menu';
import './active-element';
import Readability from './readability';
import { readerify } from './reader';
import { parseMetadata } from './metadata-parsing';
import { reload } from './reload';

window._readerify = readerify.bind(null, Readability);
window._parseMetadata = parseMetadata;
// Expose _TOFINO_RELOAD for the tofino://sessionrestore URLs that need
// the webview to reload itself
window._TOFINO_RELOAD = reload;

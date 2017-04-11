
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

import Styles from './menu-item-text-contents.css';

@CSSModules(Styles, {
  allowMultiple: true,
})
export default class MenuItemTextContents extends PureComponent {
  render() {
    return (
      <div styleName="menu-item-text-contents">
        {this.props.children}
      </div>
    );
  }
}

MenuItemTextContents.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

MenuItemTextContents.defaultProps = {
  children: [],
};

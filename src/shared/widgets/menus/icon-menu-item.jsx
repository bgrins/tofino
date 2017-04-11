
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

import Styles from './icon-menu-item.css';
import CustomMenuItem from './custom-menu-item';
import MenuItemTextContents from './common/menu-item-text-contents';
import FittedImage from '../fitted-image';

@CSSModules(Styles, {
  allowMultiple: true,
})
export default class IconMenuItem extends PureComponent {
  render() {
    return (
      <CustomMenuItem>
        <FittedImage
          src={this.props.src}
          width="14px"
          height="14px"
          styleName="icon"
        />
        <MenuItemTextContents>
          {this.props.children}
        </MenuItemTextContents>
        {this.props.expandable
          ? <FittedImage
            src="var(--theme-expando-right-image)"
            width="12px"
            height="12px"
            styleName="expando-icon"
          />
          : null
        }
      </CustomMenuItem>
    );
  }
}

IconMenuItem.propTypes = {
  src: PropTypes.string.isRequired,
  expandable: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

IconMenuItem.defaultProps = {
  expandable: false,
  children: [],
};

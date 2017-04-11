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

import Styles from './app-menu.css';
import Doorhanger from '../../../../shared/widgets/floating/doorhanger';
import HorizontalSeparator from '../../../../shared/widgets/horizontal-separator';
import IconMenuItem from './../../../../shared/widgets/menus/icon-menu-item';
import PlainMenuItem from './../../../../shared/widgets/menus/plain-menu-item';
import EditMenuItem from './app-menu/edit-menu-item';

import * as UIMenusSelectors from '../../../selectors/ui-menus-selectors';

@connect(state => ({
  appMenuOpen: UIMenusSelectors.getAppMenuOpen(state),
}))
@CSSModules(Styles, {
  allowMultiple: true,
})
export default class AppMenu extends PureComponent {
  render() {
    return (
      <Doorhanger
        show={this.props.appMenuOpen}
        styleName="app-menu"
        anchorSelector=".app-menu-doorhanger-anchor"
        anchorDocument={document}
        verticalOffsetPx={-6}
        expands={{
          horizontal: 'leftwards',
          vertical: 'downwards',
        }}
      >
        <IconMenuItem src="var(--theme-app-menu-new-window-button-image)">
          New Window
        </IconMenuItem>
        <IconMenuItem src="var(--theme-app-menu-new-private-window-button-image)">
          New Private Window
        </IconMenuItem>
        <HorizontalSeparator />
        <EditMenuItem />
        <HorizontalSeparator />
        <IconMenuItem src="var(--theme-app-menu-sidebar-button-image)">
          Show Sidebar
        </IconMenuItem>
        <IconMenuItem src="var(--theme-app-menu-library-button-image)">
          Library
        </IconMenuItem>
        <IconMenuItem src="var(--theme-app-menu-extensions-button-image)">
          Customize
        </IconMenuItem>
        <IconMenuItem expandable src="var(--theme-app-menu-preferences-button-image)">
          Preferences
        </IconMenuItem>
        <HorizontalSeparator />
        <PlainMenuItem>
          Save Page As…
        </PlainMenuItem>
        <PlainMenuItem>
          Page Setup
        </PlainMenuItem>
        <IconMenuItem src="var(--theme-app-menu-print-button-image)">
          Print
        </IconMenuItem>
        <HorizontalSeparator />
        <IconMenuItem expandable src="var(--theme-app-menu-developer-button-image)">
          Developer
        </IconMenuItem>
      </Doorhanger>
    );
  }
}

AppMenu.WrappedComponent.propTypes = {
  appMenuOpen: PropTypes.bool.isRequired,
};

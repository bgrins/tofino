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

import Styles from './menu-button.css';
import Button from '../../../../../../shared/widgets/button';
import FittedImage from '../../../../../../shared/widgets/fitted-image';

import MenusModelActions from '../../../../../actions/menus-model-actions';
import * as UIMenusSelectors from '../../../../../selectors/ui-menus-selectors';

@connect(state => ({
  appMenuOpen: UIMenusSelectors.getAppMenuOpen(state),
}))
@CSSModules(Styles, {
  allowMultiple: true,
})
export default class MenuButton extends PureComponent {
  handleClick = () => {
    if (this.props.appMenuOpen) {
      this.props.dispatch(MenusModelActions.closeAppMenu());
    } else {
      this.props.dispatch(MenusModelActions.openAppMenu());
    }
  }

  render() {
    return (
      <Button
        title="Menu"
        styleName="menu-button"
        className="app-menu-doorhanger-anchor"
        onClick={this.handleClick}
      >
        <FittedImage
          src="var(--theme-app-menu-button-image)"
          width="16px"
          height="16px"
        />
      </Button>
    );
  }
}

MenuButton.WrappedComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  appMenuOpen: PropTypes.bool.isRequired,
};

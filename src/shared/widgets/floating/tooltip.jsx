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

import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import WidgetComponent from '../helpers/widget-component';
import Styles from './tooltip.css';

/**
 * Tooltips are fixed positioned elements at specified locations, which display
 * on top of any other element. They can contain any children.
 */

@CSSModules(Styles, {
  allowMultiple: true,
})
export default class Tooltip extends WidgetComponent {
  constructor(...args) {
    super(...args);
  }

  setNodeRef = (e) => {
    this._node = e;
  }

  getBoundingClientRect() {
    return this._node.getBoundingClientRect();
  }

  render() {
    return (
      <div
        ref={this.setNodeRef}
        className={this.props.className}
        styleName="tooltip"
        style={{
          left: this.props.position.x,
          top: this.props.position.y,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

Tooltip.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Tooltip.defaultProps = {
  className: '',
  children: [],
};

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

import WidgetComponent from './helpers/widget-component';
import Styles from './css-arrow.css';

@CSSModules(Styles, {
  allowMultiple: true,
})
export default class CSSArrow extends WidgetComponent {
  render() {
    let inline;

    if (this.props.point === 'up') {
      inline = {
        borderLeft: `${this.props.width} solid transparent`,
        borderRight: `${this.props.width} solid transparent`,
        borderBottom: `${this.props.height} solid ${this.props.color}`,
      };
    } else if (this.props.point === 'down') {
      inline = {
        borderLeft: `${this.props.width} solid transparent`,
        borderRight: `${this.props.width} solid transparent`,
        borderTop: `${this.props.height} solid ${this.props.color}`,
      };
    } else if (this.props.point === 'left') {
      inline = {
        borderTop: `${this.props.width} solid transparent`,
        borderBottom: `${this.props.width} solid transparent`,
        borderRight: `${this.props.height} solid ${this.props.color}`,
      };
    } else if (this.props.point === 'right') {
      inline = {
        borderTop: `${this.props.width} solid transparent`,
        borderBottom: `${this.props.width} solid transparent`,
        borderLeft: `${this.props.height} solid ${this.props.color}`,
      };
    }

    return (
      <div
        styleName="css-arrow"
        className={this.props.className}
        style={{ ...this.props.style, ...inline }}
      />
    );
  }
}

CSSArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  point: PropTypes.oneOf(['up', 'down', 'left', 'right']),
  color: PropTypes.string,
};

CSSArrow.defaultProps = {
  className: '',
  style: {},
  point: 'up',
  color: '#000',
};

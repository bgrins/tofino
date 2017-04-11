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

/* global requestAnimationFrame, cancelAnimationFrame */

import React, { PropTypes } from 'react';
import isBrowser from 'is-browser';

import WidgetComponent from '../helpers/widget-component';
import StaticDoorhanger from './static-doorhanger';

/**
 * Doorhangers are smart-ish wrappers around static doorhangers which
 * continuously and automatically calculate their positioning based on certain
 * `expands` rules and an `anchorSelector` in a particular `anchorDocument`.
 */

export default class Doorhanger extends WidgetComponent {
  constructor(...args) {
    super(...args);
    this.state = { position: { x: 0, y: 0 } };
  }

  componentDidMount() {
    this.updatePosition();
  }

  componentWillUnmount() {
    if (isBrowser) {
      cancelAnimationFrame(this._positionUpdater);
    }
  }

  setDoorhangerRef = (e) => {
    this._doorhanger = e;
  }

  updatePosition = () => {
    if (isBrowser) {
      this._positionUpdater = requestAnimationFrame(this.updatePosition);
    }

    const anchor = this.props.anchorDocument.querySelector(this.props.anchorSelector);
    if (!anchor || !this.props.show) {
      return;
    }

    const anchorBounds = anchor.getBoundingClientRect();
    const doorhangerBounds = this._doorhanger.getBoundingClientRect();

    const anchorCenterX = anchorBounds.left + (anchorBounds.width / 2);
    const anchorTopY = anchorBounds.top;
    const anchorBottomY = anchorBounds.bottom;

    const position = {};

    if (this.props.expands.horizontal === 'rightwards') {
      position.x = anchorCenterX;
    } else {
      position.x = anchorCenterX - doorhangerBounds.width;
    }

    if (this.props.expands.vertical === 'downwards') {
      position.y = anchorBottomY;
    } else {
      position.y = anchorTopY - doorhangerBounds.height;
    }

    position.x += this.props.horizontalOffsetPx;
    position.y += this.props.verticalOffsetPx;

    this.setState({ position });
  }

  render() {
    return (<StaticDoorhanger
      {...this.props}
      ref={this.setDoorhangerRef}
      position={this.state.position}
    />);
  }
}

Doorhanger.propTypes = {
  anchorSelector: PropTypes.string.isRequired,
  anchorDocument: PropTypes.shape({
    querySelector: PropTypes.func.isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  expands: PropTypes.shape({
    horizontal: PropTypes.oneOf(['leftwards', 'rightwards']).isRequired,
    vertical: PropTypes.oneOf(['upwards', 'downwards']).isRequired,
  }).isRequired,
  horizontalOffsetPx: PropTypes.number,
  verticalOffsetPx: PropTypes.number,
};

Doorhanger.defaultProps = {
  horizontalOffsetPx: 0,
  verticalOffsetPx: 0,
};

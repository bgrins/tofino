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

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Style from '../../../../shared/style';
import Ratings from './ratings';

const GRADIENT_MASK = `
  -webkit-gradient(linear, center top, center bottom,
  color-stop(0.8, rgba(255,255,255,1)),
  color-stop(1, rgba(255,255,255,0)))`;

const CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  flexDirection: 'column',
  overflow: 'hidden',
});

const TITLE_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingBottom: '1px',
  color: 'var(--theme-overview-summary-title-color)',
  WebkitMaskImage: GRADIENT_MASK,
});

const PRICE_STYLE = Style.registerStyle({
  fontWeight: 'bold',
  flexShrink: 0,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const REVIEW_COUNT_STYLE = Style.registerStyle({
  flexShrink: 0,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '90%',
  color: 'var(--theme-overview-summary-subtitle-color)',
});

class ProductSummary extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const priceEl = this.props.price ? (
      <div className={PRICE_STYLE}>
        {this.props.price}
      </div>
    ) : undefined;

    const ratingsEl = this.props.rating ? (
      <Ratings rating={this.props.rating}
        maxRating={this.props.maxRating}
        minRating={this.props.minRating} />
    ) : undefined;

    const reviewEl = this.props.reviewCount ? (
      <div className={REVIEW_COUNT_STYLE}>
        {`${this.props.reviewCount} reviews`}
      </div>
    ) : undefined;

    return (
      <div className={CONTAINER_STYLE}>
        <div className={TITLE_STYLE}>
          {this.props.title}
        </div>
        {priceEl}
        {ratingsEl}
        {reviewEl}
      </div>
    );
  }
}

ProductSummary.displayName = 'ProductSummary';

ProductSummary.propTypes = {
  price: PropTypes.string,
  title: PropTypes.string.isRequired,
  reviewCount: PropTypes.number,
  rating: PropTypes.number,
  maxRating: PropTypes.number,
  minRating: PropTypes.number,
};

export default ProductSummary;

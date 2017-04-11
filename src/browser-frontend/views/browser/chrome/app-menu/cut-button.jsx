
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

import Button from '../../../../../shared/widgets/button';
import FittedImage from '../../../../../shared/widgets/fitted-image';

export default class CutButton extends PureComponent {
  handleCut = () => {
    // TODO
  }

  render() {
    return (
      <Button
        className={this.props.className}
        title="Cut"
        onClick={this.handleCut}
      >
        <FittedImage
          src="var(--theme-app-menu-cut-button-image)"
          width="14px"
          height="14px"
        />
      </Button>
    );
  }
}

CutButton.propTypes = {
  className: PropTypes.string,
};

CutButton.defaultProps = {
  className: '',
};

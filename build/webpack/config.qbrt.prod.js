// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import * as Paths from '../../src/shared/paths';
import baseProdConfig from './config.default-prod';
import webpack from 'webpack';

export default {
  ...baseProdConfig,
  context: Paths.QBRT_RUNNER_SHELL_SRC,
  entry: [
    `./main.js`,
  ],
  plugins: [
    // new webpack.DefinePlugin({
      // "WebSocket": "Components.utils.import('resource://gre/modules/Services.jsm', {}).Services.appShell.hiddenDOMWindow.WebSocket",
      // "Object": "Components.utils.import('resource://gre/modules/Services.jsm', {}).Services.appShell.hiddenDOMWindow.Object",
    // })
  ],
  output: {
    ...baseProdConfig.output,
    path: Paths.QBRT_RUNNER_SHELL_DST,
    filename: 'main.js',
  },
};

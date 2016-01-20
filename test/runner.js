'use strict';

require('babel-core/register')({
  presets: ['es2015'],
  plugins: ['transform-object-rest-spread']
});

require('./fetch-wrapper.test.js');

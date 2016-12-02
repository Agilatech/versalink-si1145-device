/*
 Copyright © 2016 Agilatech. All Rights Reserved.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const options = require('./options');

const Scout = require('zetta-scout');
const Si1145 = require('../si1145');
const util = require('util');

var Si1145Scout = module.exports = function(opts) {
    
  // see if any of the options were overridden in the server

  if (typeof opts !== 'undefined') {
    if (typeof opts['bus'] !== 'undefined') {
        options['bus'] = opts['bus'];
    }

    if (typeof opts['streamPeriod'] !== 'undefined') {
        options['streamPeriod'] = opts['streamPeriod'];
    }

    if (typeof opts['devicePoll'] !== 'undefined') {
        options['devicePoll'] = opts['devicePoll'];
    }

    if (typeof opts['deltaPercent'] !== 'undefined') {
        options['deltaPercent'] = opts['deltaPercent'];
    }
    
  }

  Scout.call(this);
};

util.inherits(Si1145Scout, Scout);

Si1145Scout.prototype.init = function(next) {

  var self = this;

  var query = this.server.where({name: 'SI1145'});
  
  this.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Si1145, options);
      self.server.info('Provisioned SI1145');
    } else {
      self.discover(Si1145, options);
      self.server.info('Discovered new device SI1145');
    }
  });

  next();

};

'use strict';
var Winston = require('winston');
var path = require('path');
var tsFormat = () => (new Date()).toLocaleTimeString();

Winston.emitErrs = true;

var logger = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      humanReadableUnhandledException: true,
      timestamp: tsFormat,
      colorize: true,
      level: 'verbose'
    }),
    new (require('winston-daily-rotate-file'))({
      humanReadableUnhandledException: true,
      name: 'file:exceptions',
      filename: path.resolve(__dirname, '..', '..', 'logs/-exceptions.log'),
      timestamp: tsFormat,
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      level: 'exception',
      json: false
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'file:errors',
      filename: path.resolve(__dirname, '..', '..', 'logs/-errors.log'),
      timestamp: tsFormat,
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      level: 'error',
      json: false
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'file:console',
      filename: path.resolve(__dirname, '..', '..', 'logs/-console.log'),
      timestamp: tsFormat,
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      level: 'debug',
      json: false
    })
  ]
});

module.exports = logger;

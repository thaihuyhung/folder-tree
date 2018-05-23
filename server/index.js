'use strict';
var app = require('./server.js'),
  fs = require('fs');

if(!fs.existsSync(__dirname + '/data/documents.json')){
  require('./populate.js');
}

app.start();
'use strict';
var express = require('express'),
  q = require('q'),
  _ = require('lodash'),
  utils = require('./utils');

var app = express();
var config = require('../config.js');
const path = require('path')
const compress = require('compression')
const webpackConfig = require('../webpack.config')
const project = require('../project.config')
const logger = require('./logger')
const webpack = require('webpack')

app
  .use(require('body-parser').json())
  //Introduce some latency to the mix
  .use(function(req, res, next){
    var latency = parseInt(process.env.LATENCY || config.mock_server.latency, 10) || 0;
    setTimeout(next, (0.8 + Math.random() * 0.4) * latency);
  })
  .use(require('cors')())

//Creating stores
var db = require('./repositories.js');

//Helper function for creating a promise express handler
function qExpressJson(func){
  return function(req, res){
    q.promised(func)(req, res).then(function(data){
      return res.json(data).end();
    }).done();
  };
}
//Hooking up basic api
function constructChildren(documents, parentId){
  parentId = parentId || null;
  var documentsMap = _.keyBy(documents, 'id');
  var rootChildren = [];
  _.each(documents, function(document){
    var childrenArray;
    if(document.parentId !== parentId){
      var parent = documentsMap[document.parentId];
      if(!parent) return;
      if(!parent.children) parent.children = [];
      childrenArray = parent.children;
    } else {
      childrenArray = rootChildren;
    }
    childrenArray.push(document);
  });
  return rootChildren;
}
var queryDocuments = function(req){
  var params = {},
    parentId = parseInt(req.query.parentId, 10) || null,
    search = req.query.search,
    includeChildren = req.query.includeChildren === '1' || false;

  if(search){
    var searchRegExp = new RegExp(search, 'i');
    params['$or'] = [{ number: searchRegExp }, { name: searchRegExp }];
  }
  
  if(parentId != null){
    params.ancestor = { $elemMatch: parentId };
  }

  return db.documents.qfind(params).then(function(documents){
    var ids = _.chain(documents)
      .map(_.property('ancestor'))
      .map(function(ancestor){
        if(parentId != null){
          var index = ancestor.indexOf(parentId);
          var value = _.take(ancestor, index);
          return value;
        }
        return ancestor;
      })
      .flatten()
      .uniqBy('id')
      .value();

    var folderParams = {
      type : 'folder',
      id : {
        '$in' : ids
      }
    };

    return db.documents.qfind(folderParams).then(function(folders){
      var filteredDocuments = _.chain(documents).concat(folders).filter(function(document){
        return includeChildren || document.parentId == parentId;
      }).uniqBy('id').value();
      return constructChildren(utils.sort(filteredDocuments), parentId);
    });
  });
};

app.route('/api/documents').get(qExpressJson(function(req){
  return queryDocuments(req);
}));

if (project.env === 'development') {
  const compiler = webpack(webpackConfig)

  logger.info('Enabling webpack development and HMR middleware')
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : path.resolve(project.basePath, project.srcDir),
    hot         : true,
    quiet       : false,
    noInfo      : false,
    lazy        : false,
    stats       : 'normal',
  }))
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(path.resolve(project.basePath, 'public')))

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use('*', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    console.log('filename', filename)
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
} else {
  logger.warn(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(path.resolve(project.basePath, project.outDir)))
}

module.exports = {
  start : function(){
    var server = app.listen(process.env.PORT || config.mock_server.port || 3000, function(){
      console.log('server started on port %d', server.address().port);
    });

    return server;
  }
};
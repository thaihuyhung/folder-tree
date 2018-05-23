var _ = require('lodash'),
  //jshint -W079
  btoa = require('btoa'),
  //jshint +W079
  fs = require('fs'),
  q = require('q'),
  utils = require('./utils');
try {
  fs.unlinkSync(__dirname + '/data/documents.json');
} catch(e){}

var repos = require('./repositories.js');
var count = 1;
var folderCount = 1;
var docCount = 1;

//Create random folders
var folders = _.chain(5)
  .times(_.partial(recurse, 0, null))
  .flatten()
  .value();

function recurse(depth, parentId){
  var id = count++;
  var folders = [createFolder(id, parentId)];
  if(depth < 2){
    folders = folders.concat(_.chain(5).times(_.partial(recurse, depth + 1, id)).flatten().value());
  }
  return folders;
}

function createFolder(id, parentId){
  return {
    id : id,
    name : 'Folder ' + (folderCount++),
    isFolder : true,
    type : 'folder',
    parentId : parentId || null
  };
}

//Create random documents
function createDocument(parentId){
  return {
    id : count++,
    name : 'Document ' + (docCount++) + ':' + btoa(_.random(0, 10000)),
    isFolder : false,
    parentId : parentId || null,
    fileSize : _.random(1, 1024 * 1024 * 1024 * 1.5)
  };
}
var folderIds = _.chain(folders).map('id').concat([null]).value();
var documents = _.chain(5000).times(function(){
  return createDocument(_.sample(folderIds));
}).value();

//Make a couple of the documents and folders with really long names
_.chain(documents).sample(500).each(function(document){
  document.name += ' long text document Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rutrum eu leo sit amet rutrum. Vivamus pretium tristique nunc id hendrerit. Phasellus a dolor a orci facilisis facilisis. Nullam scelerisque efficitur neque, id pulvinar nibh interdum vel. Mauris ac neque laoreet, bibendum enim in, ultrices tortor. Cras pellentesque nibh lacus, et euismod augue tempus eget. In at urna in tellus consequat pretium. Praesent sed nisi augue. Vivamus lobortis dapibus ligula, eu ullamcorper turpis ultrices in.';
});
_.chain(folders).sample(5).each(function(folder){
  folder.name += ' long folder name Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rutrum eu leo sit amet rutrum. Vivamus pretium tristique nunc id hendrerit. Phasellus a dolor a orci facilisis facilisis. Nullam scelerisque efficitur neque, id pulvinar nibh interdum vel. Mauris ac neque laoreet, bibendum enim in, ultrices tortor. Cras pellentesque nibh lacus, et euismod augue tempus eget. In at urna in tellus consequat pretium. Praesent sed nisi augue. Vivamus lobortis dapibus ligula, eu ullamcorper turpis ultrices in.';
});

//Join and sorted
var sorted = utils.sort(folders.concat(documents));

//Adding numbers
function setNumber(node, i, collection, parentIds){
  var number = i + 1;
  if(number < 10){
    number = '0' + number;
  } else {
    number = '' + number;
  }
  parentIds = parentIds || [];
  parentIds = parentIds.concat([number]);
  node.number = parentIds.join('.') + '.';
  _.chain(sorted).filter({ parentId : node.id }).each( _.partialRight( setNumber, parentIds ) );
}
_.chain(sorted).filter({ parentId : null }).each(setNumber);

//Adding an ancestor array for easier search
var getAncestors = _.memoize(function(id){
  var child = _.find(sorted, { id : id});
  if(child && child.parentId != null){
    return [child.parentId].concat(getAncestors(child.parentId));
  }
  return [];
});
_.each(sorted, function(child){
  child.ancestor = getAncestors(child.id);
});
repos.documents.insert(sorted);
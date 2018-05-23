export const flattenDeep = (array) => {
  return array.reduce((pre, cur) => Array.isArray(cur) ? pre.concat(flattenDeep(cur)) : pre.concat(cur), []);
}

export const flattenDocuments = (array = []) => {
  return array.reduce((pre, cur) => {
    return cur.isFolder ? pre.concat(flattenDocuments(cur.children)) : pre.concat(cur)
  }, []);
}

export const formatBytes = (bytes,decimals) => {
  if(bytes == 0) return '0 Bytes';
  var k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const expandAllFolder = (item) => {
  if (item.children && item.children.length) {
    item.expanded = true;
    item.children.forEach(child => expandAllFolder(child));
  }
  return item;
}

export const collapseAllFolder = (item) => {
  if (item.get('children') && item.get('children').size) {
    item = item.set('expanded', false);
    let children = item.get('children');
    children = children.map(child => collapseAllFolder(child));
    return item.set('children', children);
  }
  return item;
}

import React, { Component } from 'react';
import Folder from '../Folder';
import File from '../File';

const DocumentItem = ({ 
    path,
    query,
    data,
    queryDocuments,
    collapseFolder,
    collapsedAll,
    idsPath 
  }) => {
  if (data.get('isFolder')){
    return (
      <Folder 
        data={data} 
        path={path}
        queryDocuments={queryDocuments} 
        collapseFolder={collapseFolder}
        collapsedAll={collapsedAll}
        idsPath={idsPath}
      />
    );
  }
  return (
    <File 
      data={data} 
      query={query}
      queryDocuments={queryDocuments} 
    />
  );
};

export default DocumentItem;
"use strict";

var patterns = {
  rowDelimiter: /\n/,
  columnDelimiter: /\s*\|\s*/,
  horizontalHeadings: /^(([^\|]+\|)*([^\|]+)\n)((\s*\d+\s*\|)*(\s*\d+\s*))$/,
  verticalHeadings: /^(([^\|]+\|)([^\|]+)\n)(([^\|]+\|)(\s*\d+\s*)\n)*(([^\|]+\|)(\s*\d+\s*))$/,
  twoDimensional: /^(([^\|]+\|)+([^\|]+)\n)(([^\|]+\|)(\s*\d+\s*\|)+(\s*\d+\s*)\n)*(([^\|]+\|)(\s*\d+\s*\|)+(\s*\d+\s*))$/
};

var parseChartTagContent = function(content) {
  var lines = content.split(patterns.rowDelimiter).filter(function(line) { return line; });
  var headers = [];
  var bodys = [];

  if (patterns.horizontalHeadings.test(content)) {
    headers = lines[0].split(patterns.columnDelimiter);
    var data = lines[1].split(patterns.columnDelimiter);
    bodys.push({ name: 'Value', data: data });
  } else if (patterns.verticalHeadings.test(content)) {
    var data = [];
    for (var i = 1; i < lines.length; i++) {
      var pair = lines[i].split(patterns.columnDelimiter);
      headers.push(pair[0]);
      data.push(pair[1]);
    }

    var name = lines[0].split(patterns.columnDelimiter)[1];
    bodys.push({ name: name, data: data });
  } else if (patterns.twoDimensional.test(content)) {
    headers = lines[0].split(patterns.columnDelimiter).slice(1);
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].split(patterns.columnDelimiter);
      var name = line[0];
      var data = line.slice(1);
      bodys.push({ name: name, data: data });
    }
  }

  var table = {
    headers: headers,
    bodys: bodys
  };

  return table;
};

var chartTag = function(type, args, content) {
  return content;
};

var barchartTag = function(args, content) {
  return chartTag('bar', args, content);
};

var linechartTag = function(args, content) {
  return chartTag('line', args, content);
};

var piechartTag = function(args, content) {
  return chartTag('pie', args, content);
};

hexo.extend.tag.register('barchart', barchartTag, true);
hexo.extend.tag.register('linechart', linechartTag, true);
hexo.extend.tag.register('piechart', piechartTag, true);

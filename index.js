"use strict";

var chartTag = function(type, args, content){
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

'use strict';

var easycharts = require('./lib/easycharts.js');

hexo.extend.filter.register('inject_ready', function(inject) {
  inject.headBegin.script({ src: 'https://unpkg.com/echarts@3.3.2/dist/echarts.min.js' });
});

hexo.extend.tag.register('barchart', easycharts.barchartTag, true);
hexo.extend.tag.register('linechart', easycharts.linechartTag, true);
hexo.extend.tag.register('piechart', easycharts.piechartTag, true);

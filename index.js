'use strict';

var easycharts = require('./lib/easycharts.js');

hexo.extend.tag.register('barchart', easycharts.barchartTag, true);
hexo.extend.tag.register('linechart', easycharts.linechartTag, true);
hexo.extend.tag.register('piechart', easycharts.piechartTag, true);

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

var shouldCombined = function(name) {
 return /^.+\((.+)\)$/.test(name);
};

var barchartOption = function(title, table, asLinechart) {
  var option = {
    title: {
      text: title
    },
    animation: true,
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      data: table.headers
    },
    yAxis: {},
    series: []
  };

  var type = asLinechart? 'line' : 'bar';
  var legend = [];
  var bodys = table.bodys;
  for (var i = 0; i < bodys.length; i++) {
    var row = bodys[i];
    var name = row['name'];
    var data = row['data'];

    var item = { name: name, type: type, data: data };
    if (shouldCombined(name)) {
      item['stack'] = RegExp.$1;
    }

    if (asLinechart) {
      item['areaStyle'] = { normal: {} };
    }

    legend.push(name);
    option['series'].push(item);
  }

  if (legend.length > 1) {
    option['legend'] = { data: [] };
    option['legend']['data'] = legend;
  }

  if (asLinechart) {
    option['grid'] = {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    };
    option['xAxis']['boundaryGap'] = false;
  }

  return option;
};

var linechartOption = function(title, table) {
  return barchartOption(title, table, true);
};

var chartOption = function(type, title, table) {
  var option = {};
  if (type === 'bar') {
    option = barchartOption(title, table);
  } else if (type === 'line') {
    option = linechartOption(title, table);
  }

  return option;
};

var chartTag = function(type, args, content) {
  var html = content;
  var title = args[0] || '';
  var table = parseChartTagContent(content);
  var option = chartOption(type, title, table);

  if (option['series'] && option['series'].length > 0) {
    var tagId = Math.random().toString(36).slice(2);
    var html = `
      <div id="${tagId}" class="hexo-tag-easy-charts" style="width: 100%; min-width: 600px; height: 480px;"></div>

      <script type="text/javascript">
        var chart = echarts.init(document.getElementById('${tagId}'));
        chart.setOption(${JSON.stringify(option)});
      </script>
    `
  }

  return html;
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

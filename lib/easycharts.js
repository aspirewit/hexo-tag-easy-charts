'use strict';

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

var barchartOption = function(title, table, attrs, asLinechart) {
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

  if (attrs.legend === 'false') {
    delete option['legend'];
  }

  return option;
};

var linechartOption = function(title, table, attrs) {
  return barchartOption(title, table, attrs, true);
};

var piechartOption = function(title, table, attrs) {
  var headers = table.headers;

  var option = {
    animation: true,
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      data: headers
    },
    series:[]
  };

  var row = table.bodys[0];
  var name = row['name'];
  var data = row['data'];

  var pairs = [];
  for (var i = 0; i < data.length; i++) {
    pairs.push({ value: data[i], name: headers[i] });
  }

  var item = {
    name: name,
    type: 'pie',
    radius : '72%',

    data: pairs,
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  };

  option['series'].push(item);

  if (attrs.legend === 'false') {
    delete option['legend'];
  }

  return option;
};

var chartOption = function(type, title, table, attrs) {
  var option = {};
  if (type === 'bar') {
    option = barchartOption(title, table, attrs);
  } else if (type === 'line') {
    option = linechartOption(title, table, attrs);
  } else if (type === 'pie') {
    option = piechartOption(title, table, attrs);
  }

  return option;
};

var parseAttrs = function(argArray) {
  var attrs = {};
  for (var i = 1; i < argArray.length; i++) {
    var txt = argArray[i];
    if (txt.length > 2) {
      if (txt[0] === '\'' || txt[0] === '"') {
        txt = txt.substring(1, txt.length - 1);
      }
    }
    var parseAttr = txt.split(':');
    attrs[parseAttr[0]] = parseAttr[1];
  }
  return attrs;
};

var chartTag = function(type, args, content) {
  var html = content;
  var title = args[0] || '';
  var attrs = parseAttrs(args);
  var width = attrs.width || '100%';
  var height = attrs.height || '480px';
  var table = parseChartTagContent(content);
  var option = chartOption(type, title, table, attrs);

  if (option['series'] && option['series'].length > 0) {
    var tagId = Math.random().toString(36).slice(2);
    var html = `
      <div id="${tagId}" class="hexo-tag-easy-charts" style="width: ${width}; height: ${height};"></div>

      <script type="text/javascript">
        var chart = echarts.init(document.getElementById('${tagId}'));
        chart.setOption(${JSON.stringify(option)});
      </script>
    `
  }

  return html;
};

module.exports = {
  barchartTag: function(args, content) {
    return chartTag('bar', args, content);
  },

  linechartTag: function(args, content) {
    return chartTag('line', args, content);
  },

  piechartTag: function(args, content) {
    return chartTag('pie', args, content);
  }
};

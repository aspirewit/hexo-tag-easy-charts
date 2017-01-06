# hexo-tag-easy-charts
The easy to use chart tags for the hexo

## Installation
```
1. npm install hexo-tag-easy-charts --save
2. add following javascript file into the <head> section of layout file in the used theme
   https://unpkg.com/echarts@3.3.2/dist/echarts.min.js
```

## Barchart

### Horizontal Headings
```
{% barchart 'Barchart with Horizontal Headings' %}
Durian | Clementine | Durian | Mulberry | Papaya | Rambutan
97 | 72 | 89 | 93 | 68 | 75
{% endbarchart %}
```
![Barchart with Horizontal Headings](arts/barchart-with-horizontal-headings.png)

### Vertical Headings
```
{% barchart 'Barchart with Vertical Headings' %}
Fruit | Sales
Durian | 56
Clementine | 85
Durian | 73
Mulberry | 93
Papaya | 68
Rambutan | 53
{% endbarchart %}
```
![Barchart with Vertical Headings](arts/barchart-with-vertical-headings.png)

### Two Dimensional
```
{% barchart 'Barchart with Two Dimensional' %}
Quarter | Durian | Clementine | Durian | Mulberry | Papaya | Rambutan
Q1 | 80 | 73 | 72 | 62 | 83 | 65
Q2 | 56 | 60 | 50 | 58 | 57 | 63
Early Q3(Q3) | 61 | 72 | 85 | 76 | 69 | 88
Late Q3(Q3) | 83 | 91 | 98 | 82 | 62 | 86
Q4 | 54 | 58 | 67 | 64 | 50 | 93
{% endbarchart %}
```
![Barchart with Two Dimensional](arts/barchart-with-two-dimensional.png)

Note: `Early Q3(Q3)` and `Late Q3(Q3)` will automatically combined.

## Linechart

### Horizontal Headings
```
{% linechart 'Linechart with Horizontal Headings' %}
Durian | Clementine | Durian | Mulberry | Papaya | Rambutan
97 | 72 | 89 | 93 | 68 | 75
{% endlinechart %}
```
![Linechart with Horizontal Headings](arts/linechart-with-horizontal-headings.png)

### Vertical Headings
```
{% linechart 'Linechart with Vertical Headings' %}
Fruit | Sales
Durian | 56
Clementine | 85
Durian | 73
Mulberry | 93
Papaya | 68
Rambutan | 53
{% endlinechart %}
```
![Linechart with Vertical Headings](arts/linechart-with-vertical-headings.png)

### Two Dimensional
```
{% linechart 'Linechart with Two Dimensional' %}
Quarter | Durian | Clementine | Durian | Mulberry | Papaya | Rambutan
Q1 | 80 | 73 | 72 | 62 | 83 | 65
Q2 | 56 | 60 | 50 | 58 | 57 | 63
Early Q3(Q3) | 61 | 72 | 85 | 76 | 69 | 88
Late Q3(Q3) | 83 | 91 | 98 | 82 | 62 | 86
Q4 | 54 | 58 | 67 | 64 | 50 | 93
{% endlinechart %}
```
![Linechart with Two Dimensional](arts/linechart-with-two-dimensional.png)

Note: `Early Q3(Q3)` and `Late Q3(Q3)` will automatically combined.

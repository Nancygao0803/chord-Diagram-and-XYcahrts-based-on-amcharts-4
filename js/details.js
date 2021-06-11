
(function(window){
	/** 
   * 时间对象的格式化; 
   */
  Date.prototype.format = function(format) { //给日期添加format原型
    /* 
     * 使用例子:format="yyyy-MM-dd hh:mm:ss"; 
     */
    var o = {
      "M+": this.getMonth() + 1, // month  
      "d+": this.getDate(), // day  
      "h+": this.getHours(), // hour  
      "m+": this.getMinutes(), // minute  
      "s+": this.getSeconds(), // second  
      "q+": Math.floor((this.getMonth() + 3) / 3), // quarter  
      "S": this.getMilliseconds()
        // millisecond  
    };

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  };
})(window);

var Page = {

    getChordDiag: function (ele, data, tooltipText) {

        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_kelly);
            // Themes end
            am4core.addLicense('ch-custom-attribution');
            var chart = am4core.create(ele, am4charts.ChordDiagram);

            // colors of main characters
            chart.colors.saturation = 0.65;
            chart.colors.step = 3;
            var colors = {
                // Rachel: chart.colors.next(),
                // Monica: chart.colors.next(),
                // Phoebe: chart.colors.next(),
                // Ross: chart.colors.next(),
                // Joey: chart.colors.next(),
                // Chandler: chart.colors.next()
            }
            // chart.colors.list=[
            //     am4core.color("#FFF"),
            //     am4core.color("#000")
            // ];
            chart.data = data;
            chart.dataFields.fromName = "from";
            chart.dataFields.toName = "to";
            chart.dataFields.value = "value";
            chart.dataFields.color = "color";

            chart.nodePadding = 0.5;
            chart.minNodeSize = 0.01;
            chart.startAngle = 80;
            chart.endAngle = chart.startAngle + 360;
            chart.sortBy = "value";
            chart.fontSize = 12;
            //chart.innerRadius = 92;
            chart.color = "#DDD";
            chart.exporting.menu = new am4core.ExportMenu();
            chart.exporting.menu.align = 'right';
            chart.exporting.menu.verticalAlign = 'top';
            console.log('chart.exporting.menu',chart.exporting.menu);
            var nodeTemplate = chart.nodes.template;
            nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
            nodeTemplate.showSystemTooltip = true;
            nodeTemplate.propertyFields.fill = "color";

            nodeTemplate.tooltipText = "{name}的" + tooltipText + ": {total}";
            nodeTemplate.tooltipText.color = "#DDD";
            // when rolled over the node, make all the links rolled-over
            nodeTemplate.events.on("over", function (event) {
                var node = event.target;
                node.outgoingDataItems.each(function (dataItem) {
                    if (dataItem.toNode) {
                        dataItem.link.isHover = true;
                        dataItem.toNode.label.isHover = true;
                    }
                })
                node.incomingDataItems.each(function (dataItem) {
                    if (dataItem.fromNode) {
                        dataItem.link.isHover = true;
                        dataItem.fromNode.label.isHover = true;
                    }
                })

                node.label.isHover = true;
            })

            // when rolled out from the node, make all the links rolled-out
            nodeTemplate.events.on("out", function (event) {
                var node = event.target;
                node.outgoingDataItems.each(function (dataItem) {
                    if (dataItem.toNode) {
                        dataItem.link.isHover = false;
                        dataItem.toNode.label.isHover = false;
                    }
                })
                node.incomingDataItems.each(function (dataItem) {
                    if (dataItem.fromNode) {
                        dataItem.link.isHover = false;
                        dataItem.fromNode.label.isHover = false;
                    }
                })

                node.label.isHover = false;
            })

            var label = nodeTemplate.label;
            label.relativeRotation = 90;
            label.fill = am4core.color('#DDD')
            label.width = 50;
            label.fillOpacity = 0.4;

            label.wrap = true;
            let labelHS = label.states.create("hover");
            labelHS.properties.fillOpacity = 1;
            label.text = '{fromName}';

            nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            // this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
            nodeTemplate.adapter.add("fill", function (fill, target) {
                let node = target;
                let counters = {};
                let mainChar = false;
                node.incomingDataItems.each(function (dataItem) {
                    if (colors[dataItem.toName]) {
                        mainChar = true;
                    }

                    if (isNaN(counters[dataItem.fromName])) {
                        counters[dataItem.fromName] = dataItem.value;
                    }
                    else {
                        counters[dataItem.fromName] += dataItem.value;
                    }
                })
                if (mainChar) {
                    return fill;
                }

                let count = 0;
                let color;
                let biggest = 0;
                let biggestName;

                for (var name in counters) {
                    if (counters[name] > biggest) {
                        biggestName = name;
                        biggest = counters[name];
                    }
                }
                if (colors[biggestName]) {
                    fill = colors[biggestName];
                }

                return fill;
            })

            // link template
            var linkTemplate = chart.links.template;
            linkTemplate.strokeOpacity = 0;
            linkTemplate.fillOpacity = 0.25;
            linkTemplate.tooltipText = "{fromName} -- {toName}:{value.value}";
            linkTemplate.tooltipText.color = "#DDD";
            var hoverState = linkTemplate.states.create("hover");
            hoverState.properties.fillOpacity = 0.7;
            hoverState.properties.strokeOpacity = 0.7;


$('.amcharts-amexport-menu-level-0.amcharts-amexport-top').css({
    'top': '43px',
   
    'opacity': 0.5
})
        }); // end am4core.ready()
    },

    getStackedBar: function (el, data, SerieName) {

        // Create chart instance
        am4core.addLicense('ch-custom-attribution');
        am4core.useTheme(am4themes_animated);
        var chart1 = am4core.create(el, am4charts.XYChart);
        console.log(el, el.indexOf('4'));
        if (el.indexOf('4') != -1) {

            chart1.colors.list = [
                am4core.color("#6794DC"),
                am4core.color("#67B7DC")
            ];

        } else {
            chart1.colors.list = [
                am4core.color("#6773DC"),
                am4core.color("#67B7DC")
            ];
        }

        // Add data
        chart1.data = data;

        chart1.legend = new am4charts.Legend();
        chart1.legend.position = "left";

        chart1.legend.labels._template.fill = am4core.color("#DDD")

        // Create axes
        var categoryAxis = chart1.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        //   categoryAxis.renderer.grid.template.opacity = 0;
        categoryAxis.renderer._frequency = 1;
        categoryAxis.fontSize = 14;
        categoryAxis.labelRotation = -10;
        categoryAxis.autoGridCount = false;
        categoryAxis.gridCount = 18;
        categoryAxis.parsingStepDuration = 100;
        categoryAxis.readerHidden = false;
        categoryAxis.categoryFunction = function (valueText) {
            console.log('categoryFunction', valueText);
            return valueText;
        };
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.properties._frequency = 1;

        var labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.fill = am4core.color("#DDD");
        labelTemplate.showOnInit = false;
        labelTemplate.pixelPaddingBottom = 0;
        labelTemplate.pixelPaddingTop = 0;
        labelTemplate.truncate = true;
        labelTemplate.labelRotation = -10;
        labelTemplate.autoGridCount = false;
        labelTemplate.gridCount = 18;


        var valueAxis = chart1.xAxes.push(new am4charts.ValueAxis());
        //valueAxis.min = 0;
        valueAxis.renderer.grid.template.opacity = 0;
        //valueAxis.renderer.grid.template.fill = am4core.color("#FFF");
        valueAxis.renderer.ticks.template.strokeOpacity = 0;
        valueAxis.renderer.ticks.template.stroke = am4core.color("#DDD");
        //  valueAxis.renderer.ticks.template.length = 10;
        valueAxis.renderer.line.strokeOpacity = 0;
        valueAxis.renderer.line.fill = am4core.color("#DDD");
        valueAxis.renderer.baseGrid.disabled = false;
        //   valueAxis.renderer.minGridDistance = 10;

        valueAxis.fontSize = 12;
        valueAxis.calculateTotals = true;
        valueAxis.align = 'right';
        var labelTemplate = valueAxis.renderer.labels.template;
        labelTemplate.fill = am4core.color("#DDD");
        console.log('valueAxis', valueAxis);
        // Create series
        function createSeries(field, name, per, dx) {
            var series = chart1.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = field;
            series.dataFields.categoryY = "name";
            series.dataFields.categoryY.fill = am4core.color("#DDD");
            series.baseAxis.autoDispose = false;
            series.columns.template.height = am4core.percent(per);
            series.columns.template.dy = dx;
            series.baseAxis.align = 'right';
            //series.stacked = true;
            series.clustered = false;
            series.name = name;

           // series.tooltipText="{name} :[bold]{valueX}"  ;
            //series.stroke=am4core.color("#FFF");
            //  series.labels._template.fill=am4core.color("#FFF");
            console.log('series', series);
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.locationX = 0;
            labelBullet.label.text = "{valueX}";
            labelBullet.label.fill = am4core.color("#DDD");
            console.log('labelBullet', labelBullet);
        }

        createSeries("val1", SerieName , 80, 0);
        createSeries("val2", "交易成功数", 50, 0);
    },
    getData: function () {


        var data = [

            { "from": "西湖营业部", "to": "城北营业部", "value": 4 },
            { "from": "城北营业部", "to": "城南营业部", "value": 11 },
            { "from": "滨江营业部", "to": "余杭营业部", "value": 16 },
            { "from": "城南营业部", "to": "余杭营业部", "value": 9 },
            { "from": "余杭营业部", "to": "西湖营业部", "value": 3 },
            { "from": "萧山营业部", "to": "西湖营业部", "value": 1 },
            { "from": "淳安营业部", "to": "西湖营业部", "value": 6 },
            { "from": "桐庐营业部", "to": "建德营业部", "value": 5 },
            { "from": "建德营业部", "to": "临安营业部", "value": 5 },
            { "from": "钱塘新区营业部", "to": "余杭营业部", "value": 5 },
            { "from": "余杭营业部", "to": "临安营业部", "value": 5 },
            { "from": "淳安营业部", "to": "西湖营业部", "value": 1 },
            { "from": "滨江营业部", "to": "城南营业部", "value": 1 },
            { "from": "钱塘新区营业部", "to": "西湖营业部", "value": 5 },
            { "from": "桐庐营业部", "to": "临安营业部", "value": 3 },
            { "from": "城北营业部", "to": "城南营业部", "value": 3 }
            
        ];
        var data1 = [{ "name": "城北营业部", "val1": 34, "val2": 5 },
        { "name": "南苑营业部", "val1": 70, "val2": 5 },
        { "name": "塘栖营业部", "val1": 23, "val2": 12 },
        { "name": "瓶窑营业部", "val1": 45, "val2": 34 },
        { "name": "良渚营业部", "val1": 23, "val2": 12 },
        { "name": "余杭营业部", "val1": 44, "val2": 41 },
        { "name": "科技城营业部", "val1": 16, "val2": 9 },
        { "name": "科技城营业部8", "val1": 16, "val2": 9 },
        { "name": "科技城营业部9", "val1": 16, "val2": 9 },
        { "name": "科技城营业部10", "val1": 16, "val2": 9 }
        ];


        Page.getChordDiag('chartdiv1', data, '申购');
        Page.getChordDiag('chartdiv2', data, '挂牌');
        Page.getStackedBar('chartdiv3', data1, '申购');
        Page.getStackedBar('chartdiv4', data1, '挂牌');
       
    }

}



$(function () {
    Page.getData();

    $('#title').text(new Date().format('yyyy年MM月dd日')+'杭州市交易情况');
    $('#origin').text('预算式交易');
    $('#time').text(new Date().format('yyyy-MM-dd hh:mm:ss'));
    $('.amcharts-amexport-menu-level-0.amcharts-amexport-top').css({
        'top': '43px',
       
        'opacity': 0.5
    }) 
});



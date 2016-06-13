// Live Data Graph Polymer Script
(() => {
    'use strict';
    class LiveGraphData extends HTMLElement {
        beforeRegister() {
            this.is = 'live-data-graph'
        }
        get behaviors() {
            return [Polymer.AppLocalizeBehavior];
        }
        attached() {
            this.loadResources(this.resolveUrl('i18n/live-data-graph.json'));
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            let graph = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'spline',
                    animation: Highcharts.svg,
                    marginRight: 10,
                    events: {
                        load: function() {
                            var series = this.series[0];
                            setInterval(() => {
                                VASSPolymer.Services._AjaxService.doRequest({url:'http://jhipsterback.cfapps.io/api/graphicData', method:'GET'})
                                    .then((res) => {
                                        var x = (new Date()).getTime(),
                                            y = parseInt(res);
                                        series.addPoint([x, y], true, true);
                                    });
                            }, 1000);
                        }
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    formatter: () => {
                        return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Random data',
                    data: (function () {
                        var data = [],
                            time = (new Date()).getTime(),
                            i;
                        for (i = -19; i <= 0; i += 1) {
                            data.push({
                                x: time + i * 1000,
                                y: Math.random()
                            });
                        }
                        return data;
                    }())
                }]
            });
        }
    }
    Polymer(LiveGraphData)
})();
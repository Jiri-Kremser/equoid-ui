import { AfterViewInit, Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as c3 from 'c3';
import * as d3 from 'd3';
import * as _ from 'underscore';
// Types
import * as T from '../shared/types/common-types'

@Component({
  selector: 'equoid-stackchart',
  templateUrl: './stackchart.component.html',
  styleUrls: [
    'stackchart.scss'
  ]
})

export class StackchartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('containerStackChart') chartContainer: ElementRef;
  @Input() data: T.StackedChartData;
  @Input() id: string;
  svg: any;
  chart: any;
  isStacked = true;
  firstRun = true;

  ngAfterViewInit() {
    this.chart = c3.generate({
      bindto: '#chart-' + this.id,
      data: {
        x: 'x',
        columns: [
          ['x']
        ],
        // type: 'area-step',
        type: 'area',
        // type: 'area-spline',
        groups: [
          _.map(this.data.data, (a) => a[0])
        ],
        colors: this.data.colors
      },
      legend: {
        show: false
      },
      tooltip: {
        grouped: true,
        contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
          const text = '<table class="c3-tooltip">'
            + _.map(d, (el) => {
              if (el === null) {
                return '<tr><td>-</td><td></td><td></td></tr>'
              }
              return '<tr><td>'
                + '<span style="background-color:'
                + color(el)
                + ';"></span></td><td>'
                + el.name
                + '</td><td>'
                + el.value
                + '</td></tr>'
            }).join('')
            + '</table>';
          return text;
        },
      },
      axis: {
        x: {
          type: 'timeseries',
          extent: [5, 10],
          label: 'Time',
          tick: {
            format: '%M:%S'
          }
        },
        y: {
          label: 'Amount'
        }
      },
      point: {
        show: false
      },
      // zoom: {
      //   enabled: true
      // }
      // subchart: {
      //     show: true,
      //     size: {
      //       height: 20
      //     }
      // }
    });
  }

  update = () => {
    // if (this.data[1].ticks === undefined) {
    //   this.data[1].ticks = ['x'];
    // }
    const all = [this.data.ticks].concat(this.data.data);
    // console.log(JSON.stringify(all));
    this.chart.load({
      columns: all
    });
    const chart = this.chart;
    d3.select('#legend-stack-' + this.id).selectAll('*').remove();
    const filtered = _.filter(this.data.data, (s) => !_.every(_.rest(s, 1), (e) => e === 0))
    const keys: string[] = _.map(filtered, (a) => a[0]);
    d3.select('#legend-stack-' + this.id).selectAll('span')
      .data(keys)
      .enter().append('div')
      .attr('style', 'cursor:pointer;padding:0 10px;flex-direction:row;box-sizing:border-box;display:flex;max-height:100%;place-content:center flex-start;align-items:center;')
      .attr('fxlayoutalign', 'start center')
      .html((id) => {
        const circle = 'height: 15px;width: 15px;border-radius: 50%;margin-right: 5px;';
        return '<div class="circle" style="' + circle + 'background-color: ' + chart.color(id) + ';"></div><div style="white-space:nowrap">' + id + '</div>'
      })
      .on('mouseover', function(id) {
        chart.focus(id);
      })
      .on('mouseout', function(id) {
        chart.revert();
      })
      .on('click', function(id) {
        chart.toggle(id);
      });

    if (this.firstRun && this.isStacked) {
      this.chart.groups([_.map(this.data.data, (a) => a[0])]);
      this.firstRun = false;
    }
  }

  toggleStack = () => {
    if (this.isStacked) {
      this.chart.groups([]);
    } else {
      this.chart.groups([_.map(this.data.data, (a) => a[0])]);
    }
    this.isStacked = !this.isStacked;
  }

  ngOnInit() {
    // create chart and render
    this.createChart();

    // Initial update
    this.updateChart(true);

    const self = this;

    setInterval(() => self.update(), 3000);
    setTimeout(() =>  self.update(), 50);

    // For animation purpose we load the real value after a second
    setTimeout(() => this.updateChart(false), 50);
  }

  ngOnChanges() {
    const self = this;
    // update chart on data input value change
    if (this.chart) {
      this.update();
    }
  }

  constructor(
    private elRef: ElementRef
  ) { }

  createChart = () => {

  }

  updateChart = (firstRun: boolean) => {

  }

  arcTween(newValues, i, slice) {

  }

  // mouseover = (d, i) => {

  // }

  // mouseout = () => {

  // }
}

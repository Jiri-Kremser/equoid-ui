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
  svg: any;
  chart: any;
  isStacked = true;
  firstRun = true;

  ngAfterViewInit() {
    this.chart = c3.generate({
      bindto: '#chart',
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
        position: 'right'
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
    const all = [this.data.ticks].concat(this.data.data);
    // console.log(JSON.stringify(all));
    this.chart.load({
      columns: all
    });

    if (this.firstRun && this.isStacked) {
      this.chart.groups([_.map(this.data.data, (a) => a[0])]);
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

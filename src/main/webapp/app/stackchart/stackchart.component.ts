import { AfterViewInit, Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as c3 from 'c3';
import * as _ from 'underscore';

@Component({
  selector: 'equoid-stackchart',
  templateUrl: './stackchart.component.html',
  styleUrls: [
    'stackchart.scss'
  ]
})

export class StackchartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('containerStackChart') chartContainer: ElementRef;
  @Input() data: any;
  @Input() colors: string[];
  svg: any;
  chart: any;
  isStacked = true;
  historyLength = 50;
  ticks: any[] = ['x']

  ngAfterViewInit() {
    this.chart = c3.generate({
      bindto: '#chart',
      data: {
        x: 'x',
        columns: [
          this.ticks
        ],
        // type: 'area-step',
        type: 'area',
        // type: 'area-spline',
        groups: [
          _.map(this.data, (a) => a[0])
        ]
      },
      color: {
        pattern: this.colors
      },
      axis: {
        x: {
          type: 'timeseries',
          label: 'Time',
          tick: {
            format: '%M:%S'
          }
        },
        y: {
          label: 'Amount'
        }
      }
    });
  }

  update = () => {
    this.ticks.push(+new Date());

    if (this.ticks.length > this.historyLength + 1) {
      // forget the oldest data point
      _.each(this.data, (a) => a.splice(1, 1))
      this.ticks.splice(1, 1)
    }
    const all = [this.ticks].concat(this.data);
    // console.log(JSON.stringify(all));
    this.chart.load({
      columns: all
    });
  }

  toggleStack = () => {
    if (this.isStacked) {
      this.chart.groups([]);
    } else {
      this.chart.groups([_.map(this.data, (a) => a[0])]);
    }
    this.isStacked = !this.isStacked;
  }

  ngOnInit() {
    // create chart and render
    this.createChart();

    // Initial update
    this.updateChart(true);

    const self = this;

    setInterval(function() {
      self.update();
    }, 3000);

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

  mouseover = (d, i) => {

  }

  mouseout = () => {

  }
}

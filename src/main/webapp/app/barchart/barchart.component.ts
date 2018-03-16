import { AfterViewInit, Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as c3 from 'c3';
import * as _ from 'underscore';

// Services
import { PieDataService } from '../piechart/piechart.service';

@Component({
  selector: 'equoid-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: [
    'barchart.scss'
  ]
})

export class BarchartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('containerBarChart') chartContainer: ElementRef;
  @Input() data: any;
  @Input() colours: Array<string>;
  svg: any;
  chart: any;
  isStacked = true;
  historyLength = 50;

  ngAfterViewInit() {
    this.chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: this.data,
        // type: 'area-step',
        type: 'area',
        // type: 'area-spline',
        groups: [
          _.map(this.data, (a) => a[0])
        ]
      }
    });
  }

  update = () => {
    this.chart.load({
      columns: this.data
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
      this.chart.load({
        columns: this.data
      });
    }
  }

  constructor(
    private elRef: ElementRef,
    private pieDataService: PieDataService
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

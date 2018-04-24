import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'underscore';

// Services
import { PieDataService } from './piechart.service';

@Component({
  selector: 'equoid-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: [
    'piechart.scss'
  ]
})

export class PiechartComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() id: string;
  @Input() colors: Array<string>;

  svg: any;
  radius: number;
  innerRadius: number;
  outerRadius: number;
  htmlElement: HTMLElement;
  arcGenerator: any;
  arcHover: any;
  pieGenerator: any;
  path: any;
  values: Array<number>;
  labels: Array<string>;
  tooltip: any;
  centralLabel: any;
  pieColors: any;
  slices: Array<any>;
  selectedSlice: any;
  colorSlices: Array<string>;
  arc: any;
  arcEnter: any;

  ngOnInit() {
    // create chart and render
    setTimeout(() => {
      this.createChart();
      this.updateChart(true);
    }, 50);

    setInterval(() => this.updateChart(false), 3000);
  }

  ngOnChanges() {
    // update chart on data input value change
    if (this.svg) {
      this.updateChart(false);
    }
  }

  constructor(
    private elRef: ElementRef,
    private pieDataService: PieDataService
  ) {}

  createChart = () => {
    this.pieColors = this.colors;
    this.tooltip = this.elRef.nativeElement.querySelector('.tooltip');

    // create a pie generator and tell it where to get numeric values from and whether sorting is needed or not
    // this is just a function that will be called to obtain data prior binding that data to elements of the chart
    this.pieGenerator = d3.pie().sort(null).value((d: number) => d)([0, 0, 0]);

    // create an arc generator and configure it
    // this is just a function that will be called to obtain data prior binding that data to arc elements of the chart
    this.arcGenerator = d3.arc()
      .innerRadius(50)
      .outerRadius(60);

    this.arcHover = d3.arc()
      .innerRadius(50)
      .outerRadius(63);

    // create svg element, configure dimensions and centre and add to DOM
    this.svg = d3.select('#pie-chart-' + this.id).append('svg')
      .attr('viewBox', '0, 0, 935, 180')
      .append('g')
      .attr('transform', 'translate(467, 90)');
  }

  updateChart = (firstRun: boolean) => {
    const vm = this;

    this.slices = this.updateSlices(this.data[0]);
    this.labels = this.slices.map((slice) => slice.name);
    this.colorSlices = this.slices.map((slice) => this.pieColors[slice.name]);

    this.values = firstRun ? [0, 0, 0] : _.toArray(this.slices).map((slice) => slice.count);

    this.pieGenerator = d3.pie().sort(null).value((d: number) => d)(this.values);

    const arc = this.svg.selectAll('.arc')
      .data(this.pieGenerator);

    arc.exit().remove();

    const arcEnter = arc.enter().append('g')
      .attr('class', 'arc');

    arcEnter.append('path')
      .attr('d', this.arcGenerator)
      .each((values) => firstRun ? values.storedValues = values : null)
      .on('mouseover', this.mouseover)
      .on('mouseout', this.mouseout);

    // configure a transition to play on d elements of a path
    // whenever new values are passed in, the values and the previously stored values will be used
    // to compute the transition using interpolation
    d3.select('#pie-chart-' + this.id).selectAll('path')
      .data(this.pieGenerator)
      .attr('fill', (datum, index) => this.pieColors[this.labels[index]])
      .attr('d', this.arcGenerator)
      .transition()
      .duration(750)
      .attrTween('d', function(newValues, i){
        return vm.arcTween(newValues, i, this);
      });
  }

  arcTween(newValues, i, slice) {
    const interpolation = d3.interpolate(slice.storedValues, newValues);
    slice.storedValues = interpolation(0);

    return (t) => {
      return this.arcGenerator(interpolation(t));
    };
  }

  mouseover = (d, i) => {
    this.selectedSlice = this.slices[i];

    d3.select(d3.event.currentTarget).transition()
      .duration(200)
      .attr('d', this.arcHover);

    this.svg.append('text')
      .attr('dy', '-10px')
      .style('text-anchor', 'middle')
      .attr('class', 'label')
      .attr('fill', '#333')
      .text(this.labels[i]);

    this.svg.append('text')
      .attr('dy', '20px')
      .style('text-anchor', 'middle')
      .attr('class', 'percent')
      .attr('fill', '#333')
      .text(this.toPercent(this.values[i], this.values.reduce((sum, value) => sum + value)));

    // Tooltip
    this.tooltip.style.visibility = 'visible';
    this.tooltip.style.opacity = 0.8;
    this.tooltip.style.top = (d3.event.pageY) + 'px';
    this.tooltip.style.left = (d3.event.pageX - 100 ) + 'px';
  }

  mouseout = () => {
    this.svg.select('.label').remove();
    this.svg.select('.percent').remove();

    d3.select(d3.event.currentTarget).transition()
     .duration(100)
     .attr('d', this.arcGenerator);

    this.tooltip.style.visibility = 'hidden';
    this.tooltip.style.opacity = 0;
  }

  toPercent = (a: number, b: number): string => {
    return Math.round( a / b * 100) + '%';
  }

  updateSlices = (newData: Array<any>): Array<any> => {
    const results = [];
    const sorted = _.sortBy(newData, 'count');
    _.each(sorted, (item) => {
      results.push({
        name: item.name,
        count: item.count
      });
    });

    return results;
  }
}

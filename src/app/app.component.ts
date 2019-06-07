import { Component, OnInit } from '@angular/core';
import * as data from '../assets/db.json';
import * as type from '../assets/type.json';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as Fuse from 'fuse.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  job: any =  data.default;
  list: any = type.default;
  headerText;
  listFilter: any = [];
  constructor() {
  }
  ngOnInit() {
    this.headerText = this.job.length;
    const options = {
      keys: ['position'],
      includeScore: true,
      threshold: 0.3,
    };
    const fuse = new Fuse(this.job, options);
    this.list.forEach(item => {
      const getData: any = fuse.search(item.name.toUpperCase());
      if (getData.length !== 0) {
        this.listFilter.push({
          data: getData,
          type: item.type,
          length: getData.length
        });
      }
    });

    const chart = am4core.create('bar-chart-vertical', am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();
    chart.data = this.listFilter;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'type';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = 'length';
    series.dataFields.categoryX = 'type';
    series.tooltipText = '[{categoryX}: bold]{valueY}[/]';
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = 'vertical';

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });
    chart.cursor = new am4charts.XYCursor();
  }
}

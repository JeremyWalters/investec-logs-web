<template>
  <div :id="id"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watchEffect } from "@vue/composition-api";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themesAnimated);

export default defineComponent({
  props: {
    items: { type: Array, required: true },
    id: { type: String, required: true },
    categoryX: { type: String, required: true },
    valueY: { type: String, required: true }
  },
  setup(props: Props) {
    let chart!: am4charts.XYChart;

    onMounted(() => {
      chart = am4core.create(props.id, am4charts.XYChart);
      if (chart.svgContainer)
        chart.svgContainer.htmlElement.style.height = 200 + "px";

      initChart();
    });

    function initChart() {
      addCategoryAxis();
      addValueAxis();
      addColumnSeries();
    }

    function addCategoryAxis() {
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = props.categoryX;
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.fontSize = 12;

      formatCategoryLabels(categoryAxis);
    }

    function addValueAxis() {
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.labels.template.disabled = true;
    }

    function addColumnSeries() {
      const series = chart.series.push(new am4charts.ColumnSeries());

      series.dataFields.valueY = props.valueY;
      series.dataFields.categoryX = props.categoryX;
      series.columns.template.tooltipText =
        "Category: {categoryX}\nValue: R {valueY}";

      addSeriesAnimation(series);
    }

    function formatCategoryLabels(
      categoryAxis: am4charts.CategoryAxis<am4charts.AxisRenderer>
    ) {
      const label = categoryAxis.renderer.labels.template;
      label.wrap = true;
      label.maxWidth = 120;
    }

    function addSeriesAnimation(series: am4charts.ColumnSeries) {
      const shadow = series.columns.template.filters.push(
        new am4core.DropShadowFilter()
      );
      shadow.opacity = 0.1;

      series.columns.template.events.on("over", ev => {
        // Set hover state
        const hoverState = series.columns.template.states.create("hover");
        if (hoverState) {
          hoverState.properties.dx = -5;
          hoverState.properties.dy = -5;
          hoverState.properties.height = ev.target.bbox.height + 5;

          const hoverShadow = hoverState.filters.push(
            new am4core.DropShadowFilter()
          );
          hoverShadow.dx = 6;
          hoverShadow.dy = 6;
          hoverShadow.opacity = 0.3;
        }
      });
    }

    watchEffect(() => (chart.data = props.items));

    return {};
  }
});

interface Props {
  id: string;
  items: { [key: string]: string }[];
  categoryX: string;
  valueY: string;
}
</script>

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
    category: { type: String, required: true },
    value: { type: String, required: true }
  },
  setup(props: Props) {
    let chart!: am4charts.PieChart;

    onMounted(() => {
      chart = am4core.create(props.id, am4charts.PieChart);

      initChart();
    });

    function initChart() {
      addPieSeries();
      addLegend();
      autoAdjustChartHeight();
    }

    function addPieSeries() {
      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = props.value;
      pieSeries.dataFields.category = props.category;

      // Create gap between slices
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // Disable labeling
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.slices.template.tooltipText = `{category}: R {value}`;

      addSeriesAnimation(pieSeries);
    }

    function addLegend() {
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 10;
      chart.legend.position = "right";
      chart.legend.valign = "top";

      // Adjust Legend
      const markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 15;
      markerTemplate.height = 15;
    }

    function addSeriesAnimation(pieSeries: am4charts.PieSeries) {
      // Slide slices out on hover
      const hover = pieSeries.slices.template.states.getKey("hover");
      if (hover) {
        hover.properties.shiftRadius = 0;
        hover.properties.scale = 1.1;
      }
    }

    function autoAdjustChartHeight() {
      const cellSize = 35;
      chart.events.on("datavalidated", function(ev) {
        const chart = ev.target;
        const contentHeight = chart.contentHeight;

        // Calculate how we need to adjust chart height
        const adjustHeight = chart.data.length * cellSize - contentHeight;

        // get current chart height
        const targetHeight = chart.pixelHeight + adjustHeight;

        // Set it on chart's container
        if (chart.svgContainer)
          chart.svgContainer.htmlElement.style.height = targetHeight + "px";
      });
    }

    watchEffect(() => (chart.data = props.items));

    return {};
  }
});

interface Props {
  id: string;
  items: { [key: string]: string }[];
  category: string;
  value: string;
}
</script>

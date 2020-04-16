<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card class="pb-3">
          <v-card-title primary-title>Spending By Category</v-card-title>
          <div id="spendingByCategoryPie"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  computed,
  Ref,
  onMounted,
  watch
} from "@vue/composition-api";
import { Transaction } from "@/store/types/transactions";
import { centsToRands, formatDate } from "@/utils";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themesAnimated);

export default defineComponent({
  setup(props: unknown, context: SetupContext) {
    const store = context.root.$store;
    let chart!: am4charts.PieChart;

    onMounted(() => {
      store.dispatch("transactions/fetchSpendingByCategory");
      chart = am4core.create("spendingByCategoryPie", am4charts.PieChart);

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "spending";
      pieSeries.dataFields.category = "category";

      // Create gap between slices
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // Disable labeling
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.slices.template.tooltipText = `{category}: R {value}`;

      // Add a legend
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 10;
      chart.legend.position = "right";
      chart.legend.valign = "top";

      // Adjust Legend
      const markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 15;
      markerTemplate.height = 15;

      // Slide slices out on hover
      const hover = pieSeries.slices.template.states.getKey("hover");
      if (hover) {
        hover.properties.shiftRadius = 0;
        hover.properties.scale = 1.1;
      }

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
    });

    const categorySpending = computed(() => {
      const dict = store.state.transactions.spendingByCategory;
      if (!dict) return;

      const keys = Object.keys(dict);
      return keys.map(v => {
        return { category: v, spending: centsToRands(dict[v]) };
      });
    });

    watch(
      categorySpending,
      data => {
        chart.data = JSON.parse(JSON.stringify(categorySpending.value));
      },
      { lazy: true }
    );

    return {
      categorySpending
    };
  }
});
</script>


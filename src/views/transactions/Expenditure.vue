<template>
  <v-container>
    <v-card :loading="loading">
      <v-card-title primary-title>Expenditure</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <span class="subtitle-2 ml-2">Spending By Category</span>
            <PieChart
              id="categorySpending"
              :items="categorySpendingItems"
              category="category"
              value="spending"
            ></PieChart>
          </v-col>
          <v-col cols="6">
            <span class="subtitle-2 ml-2">Spending By Month</span>
            <ColumnChart
              id="monthlySpending"
              :items="monthlySpendingItems"
              category-x="month"
              value-y="spending"
            ></ColumnChart>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  computed,
  onMounted,
  watch,
  ref
} from "@vue/composition-api";
import { centsToRands } from "@/utils";
import ColumnChart from "@/components/charts/ColumnChart.vue";
import PieChart from "@/components/charts/PieChart.vue";

export default defineComponent({
  components: { ColumnChart, PieChart },
  setup(props: unknown, context: SetupContext) {
    const store = context.root.$store;
    const loading = computed(() => store.state.transactions.loading);

    const monthlySpendingItems = ref([]);
    const categorySpendingItems = ref([]);

    onMounted(() => {
      store.dispatch("transactions/fetchSpendingByCategory");
      store.dispatch("transactions/fetchSpendingByMonth");
    });

    const categorySpending = computed(() => {
      const dict = store.state.transactions.spendingByCategory;
      if (!dict) return;

      const keys = Object.keys(dict);
      return keys.map(v => {
        return { category: v, spending: centsToRands(dict[v]) };
      });
    });

    const monthlySpending = computed(() => {
      const dict = store.state.transactions.spendingByMonth;
      if (!dict) return;

      const keys = Object.keys(dict);
      return keys.map(v => {
        return { month: v, spending: centsToRands(dict[v]) };
      });
    });

    watch(
      categorySpending,
      data => {
        categorySpendingItems.value = JSON.parse(JSON.stringify(data));
      },
      { lazy: true }
    );

    watch(monthlySpending, data => {
      if (data) monthlySpendingItems.value = JSON.parse(JSON.stringify(data));
    });

    return {
      loading,
      categorySpendingItems,
      monthlySpendingItems
    };
  }
});
</script>

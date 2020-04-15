<template>
  <v-container class="pa-2">
    <v-card class="mx-auto">
      <v-data-table
        :headers="headers"
        :items="transactions"
        class="elevation-1"
        v-if="$vuetify.breakpoint.mdAndUp"
      >
        <template v-slot:item.centsAmount="{ item }">{{
          centsToRands(item.centsAmount)
        }}</template>
        <template v-slot:item.dateTime="{ item }">{{
          formatDate(item.dateTime, "yyyy-MM-dd HH:mm")
        }}</template>
      </v-data-table>
      <v-list two-line v-else>
        <v-list-item-group active-class="pink--text">
          <template v-for="(item, index) in transactions">
            <v-list-item :key="item.dateTime">
              <template v-slot:default>
                <v-list-item-content class="text-left">
                  <v-list-item-title
                    v-text="item.merchant.name"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="centsToRands(item.centsAmount)"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.merchant.category.name"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="formatDate(item.dateTime, 'yyyy-MM-dd HH:mm')"
                  ></v-list-item-action-text>
                  <v-list-item-action-text
                    v-text="item.reference"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider
              v-if="index + 1 < transactions.length"
              :key="index"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  computed,
  Ref,
  onMounted
} from "@vue/composition-api";
import { Transaction } from "@/store/types/transactions";
import { centsToRands, formatDate } from "@/utils";

export default defineComponent({
  setup(props: unknown, context: SetupContext) {
    const store = context.root.$store;

    // Table header mappings
    const headers = [
      { text: "Date Time", value: "dateTime" },
      { text: "Amount", value: "centsAmount" },
      { text: "Reference", value: "reference" },
      { text: "Merchant", value: "merchant.name" },
      { text: "Category", value: "merchant.category.name" },
      { text: "Account Number", value: "accountNumber" }
    ];

    const transactions: Readonly<Ref<readonly Transaction[]>> = computed(() => {
      return store.state.transactions.transactions as Transaction[];
    });

    onMounted(() => {
      store.dispatch("transactions/fetchAllTransactions");
    });

    return {
      transactions,
      headers,
      centsToRands,
      formatDate
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
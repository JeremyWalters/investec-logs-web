<template>
  <v-container>
    <v-card class="mx-auto" :loading="loading">
      <v-card-title primary-title>Transactions</v-card-title>
      <v-card-text v-if="$vuetify.breakpoint.mdAndUp">
        <v-data-table
          :headers="headers"
          :items="transactions"
          class="elevation-1"
        >
          <template v-slot:item.flagged="{ item }">
            <v-btn text icon small @click="onFlagClick(item)">
              <v-icon color="warning" v-if="item.flagged"
                >mdi-flag-variant</v-icon
              >
              <v-icon v-else>mdi-flag-variant-outline</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.centsAmount="{ item }">
            {{ centsToRands(item.centsAmount) }}
          </template>

          <template v-slot:item.dateTime="{ item }">
            {{ formatDate(item.dateTime, "yyyy-MM-dd HH:mm") }}
          </template>

          <template v-slot:item.tags="{ item }">
            <v-chip v-for="tag of item.tags" :key="tag" label small>
              {{ tag }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>

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
    const loading = computed(() => store.state.transactions.loading);

    // Table header mappings
    const headers = [
      { text: "", value: "flagged" },
      { text: "Date Time", value: "dateTime", width: 150 },
      { text: "Amount", value: "centsAmount" },
      { text: "Reference", value: "reference", class: "nobr" },
      { text: "Merchant", value: "merchant.name", class: "nobr" },
      { text: "Category", value: "merchant.category.name" },
      { text: "Account Number", value: "accountNumber", class: "nobr" },
      { text: "Tags", value: "tags", class: "nobr" }
    ];

    const transactions: Readonly<Ref<readonly Transaction[]>> = computed(() => {
      return store.state.transactions.transactions as Transaction[];
    });

    onMounted(() => {
      store.dispatch("transactions/fetchAllTransactions");
    });

    function onFlagClick(transaction: Transaction) {
      store.dispatch("transactions/setFlagged", transaction);
    }

    return {
      transactions,
      headers,
      centsToRands,
      formatDate,
      onFlagClick,
      loading
    };
  }
});
</script>
<style>
.nobr {
  white-space: nowrap;
}
</style>

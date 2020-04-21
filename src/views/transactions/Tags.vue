<template>
  <v-container>
    <v-card flat>
      <TagsDialog v-model="dialog"></TagsDialog>
      <v-card-title primary-title>Tags</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="dialog = true">Add Tags</v-btn>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
          <template v-slot:item.centsAmount="{ item }">
            {{
            centsToRands(item.centsAmount)
            }}
          </template>
        </v-data-table>
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
  ref
} from "@vue/composition-api";
import { centsToRands } from "@/utils";
import TagsDialog from "@/components/TagsDialog.vue";

export default defineComponent({
  components: { TagsDialog },
  setup(props: unknown, context: SetupContext) {
    const store = context.root.$store;
    const dialog = ref(false);
    const headers = [
      { text: "Tag Name", value: "name" },
      { text: "Amount Operator", value: "amountOperator" },
      { text: "Amount", value: "centsAmount" },
      { text: "Merchant", value: "merchantName" },
      { text: "Apply Future Transactions", value: "applyFuture" }
    ];
    onMounted(() => {
      store.dispatch("transactions/fetchAllTags");
    });

    const items = computed(() => {
      return store.state.transactions.tags;
    });

    return {
      dialog,
      items,
      headers,
      centsToRands
    };
  }
});
</script>

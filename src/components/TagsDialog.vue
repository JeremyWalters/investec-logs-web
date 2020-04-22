<template>
  <v-dialog
    v-model="value"
    scrollable
    persistent
    :overlay="false"
    width="500"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="grey lighten-2 py-2 px-3" primary-title dense
        >Tags</v-card-title
      >
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            label="Tag Name"
            @change="tagExists = false"
            :rules="[
              v => !!v || 'Tag Name Required',
              v => !tagExists || 'Tag Name Exists'
            ]"
            v-model="model.name"
          ></v-text-field>

          <v-select
            :items="linkItems"
            label="Link To:"
            v-model="link"
          ></v-select>
          <template v-if="link">
            <v-checkbox
              label="Apply To Future Transactions"
              v-model="model.applyFuture"
            ></v-checkbox>
            <v-checkbox
              disabled
              label="Apply To Existing Transactions"
              v-model="model.applyExisting"
              value="value"
            ></v-checkbox>
          </template>
          <v-row v-if="link == 'amount'">
            <v-col>
              <v-select
                label="Operator"
                :items="['<', '<=', '==', '>', '>=']"
                v-model="model.amountOperator"
                :rules="[v => !!v || 'Operator Required']"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                label="Amount In Rands"
                type="number"
                v-model.number="amount"
                min="0"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="link == 'merchant'">
            <v-col>
              <v-text-field
                label="Merchant Name"
                v-model="model.merchantName"
                :rules="[v => !!v || 'Merchant Name Required']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="$emit('input', false)">Cancel</v-btn>
        <v-btn color="primary" text @click="addTag">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  ref,
  reactive,
  Ref
} from "@vue/composition-api";
import { FirebaseState, FirestoreCollections } from "../store/modules/firebase";

export default defineComponent({
  props: {
    value: Boolean
  },
  setup(props: unknown, context: SetupContext) {
    const valid = ref(true);
    const form: Ref<any> = ref(null);
    const link = ref(null);
    const tagExists = ref(false);
    const amount = ref(0);
    const store = context.root.$store;
    const firebaseState = store.state.firebase as FirebaseState;

    const linkItems = [
      { text: "Link Merchant Name", value: "merchant" },
      { text: "Link Amount", value: "amount" },
      { text: "None", value: null }
    ];

    const model = reactive({
      name: "",
      centsAmount: 0,
      merchantName: "",
      applyExisting: false,
      applyFuture: false,
      amountOperator: ""
    });

    async function addTag() {
      if (form.value && form.value.validate()) {
        const db = firebaseState.firestore;
        if (db) {
          const tag = await db
            .collection(FirestoreCollections.TAGS)
            .doc(model.name)
            .get();

          if (tag.exists) {
            tagExists.value = true;
            form.value.validate();
          } else {
            model.centsAmount = amount.value * 100;
            store.dispatch("transactions/addTag", model);
            context.emit("input", false);
          }
        }
      }
    }

    return {
      addTag,
      link,
      linkItems,
      model,
      valid,
      form,
      tagExists,
      amount
    };
  }
});
</script>

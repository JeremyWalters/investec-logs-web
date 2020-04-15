import Vue from "vue";
import Vuex from "vuex";
import { auth, AuthState } from "@/store/modules/auth";
import { firebase, FirebaseState } from "@/store/modules/firebase";
import { transactions, TransactionsState } from "@/store/modules/transactions";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    auth,
    firebase,
    transactions
  }
});

export interface RootState {
  auth: AuthState;
  firebase: FirebaseState;
  transactions: TransactionsState;
}

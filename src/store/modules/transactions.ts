import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "..";
import { Transaction } from "../types/transactions";
import { FirestoreCollections } from "./firebase";

export interface TransactionsState {
  loading: boolean;
  transactions: Transaction[];
}

export const state: TransactionsState = {
  transactions: [],
  loading: false
};

export const actions: ActionTree<TransactionsState, RootState> = {
  async fetchAllTransactions({ commit, rootState }) {
    try {
      commit("loading");
      const db = rootState.firebase.firestore;
      if (!db) return;

      await db
        .collection(FirestoreCollections.TRANSACTIONS)
        .orderBy("dateTime", "desc")
        .onSnapshot(querySnapshot => {
          commit(
            "setTransactions",
            querySnapshot.docs.map(doc => doc.data())
          );
        });

      commit("loading", false);
    } catch (error) {
      commit("loading", false);
    }
  }
};

export const mutations: MutationTree<TransactionsState> = {
  setTransactions(state, payload) {
    state.transactions = payload;
  },
  loading(state, payload = true) {
    state.loading = payload;
  }
};

export const getters: GetterTree<TransactionsState, RootState> = {};

const namespaced = true;

export const transactions: Module<TransactionsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export default transactions;
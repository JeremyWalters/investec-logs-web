import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "..";
import { Transaction } from "../types/transactions";
import { FirestoreCollections } from "./firebase";

export interface TransactionsState {
  loading: boolean;
  transactions: Transaction[];
  tags: Tag[];
  spendingByCategory?: { [category: string]: number };
  spendingByMonth?: { [month: string]: number };
}

interface Tag {
  name: string;
  merchantName: string;
  centsAmount: number;
  amountOperator: "<" | "<=" | "==" | ">" | ">=";
  applyFuture: boolean;
}

export const state: TransactionsState = {
  transactions: [],
  tags: [],
  spendingByCategory: undefined,
  spendingByMonth: undefined,
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
            querySnapshot.docs.map(doc => {
              return { id: doc.id, ...doc.data() };
            })
          );
          commit("loading", false);
        });
    } catch (error) {
      commit("loading", false);
    }
  },
  async setFlagged({ rootState }, payload) {
    const db = rootState.firebase.firestore;
    if (db) {
      await db
        .collection(FirestoreCollections.TRANSACTIONS)
        .doc(payload.id)
        .set({ flagged: !payload.flagged }, { merge: true });
    }
  },
  async addTag({ commit, rootState, dispatch }, payload) {
    try {
      commit("loading");

      const db = rootState.firebase.firestore;
      if (!db) return;

      await db
        .collection(FirestoreCollections.TAGS)
        .doc(payload.name)
        .set(payload);

      dispatch("notifictions/success");
      commit("loading", false);
    } catch (error) {
      dispatch("notifictions/error", error, { root: true });
    }
  },
  async fetchAllTags({ commit, rootState }) {
    try {
      commit("loading");
      const db = rootState.firebase.firestore;
      if (!db) return;

      await db
        .collection(FirestoreCollections.TAGS)
        .onSnapshot(querySnapshot => {
          commit(
            "setTags",
            querySnapshot.docs.map(doc => doc.data())
          );
        });

      commit("loading", false);
    } catch (error) {
      commit("loading", false);
    }
  },
  async fetchSpendingByCategory({ commit, rootState }) {
    try {
      if (!rootState.firebase.instance) return;

      commit("loading");
      const getSpendingByCategory = rootState.firebase.instance
        .functions()
        .httpsCallable("getSpendingByCategory");
      if (getSpendingByCategory) {
        const response = await getSpendingByCategory();
        commit("setSpendingByCategory", response.data);
      }
      commit("loading", false);
    } catch (error) {
      commit("loading", false);
      //
    }
  },
  async fetchSpendingByMonth({ commit, rootState }) {
    try {
      if (!rootState.firebase.instance) return;

      commit("loading");
      const getSpendingByMonth = rootState.firebase.instance
        .functions()
        .httpsCallable("getSpendingByMonth");
      if (getSpendingByMonth) {
        const response = await getSpendingByMonth();
        commit("setSpendingByMonth", response.data);
      }
      commit("loading", false);
    } catch (error) {
      commit("loading", false);
      //
    }
  }
};

export const mutations: MutationTree<TransactionsState> = {
  setTransactions(state, payload) {
    state.transactions = payload;
  },
  setTags(state, payload) {
    state.tags = payload;
  },
  setSpendingByCategory(state, payload) {
    state.spendingByCategory = payload;
  },
  setSpendingByMonth(state, payload) {
    state.spendingByMonth = payload;
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

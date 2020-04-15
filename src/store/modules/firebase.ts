import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import * as firebaseInstance from "firebase";
import { RootState } from "..";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};

export enum FirestoreCollections {
  TRANSACTIONS = "transactions",
  CATEGORIES = "categories",
}

export interface FirebaseState {
  instance?: firebaseInstance.app.App;
  firestore?: firebaseInstance.firestore.Firestore;
  loading: boolean;
}

export const state: FirebaseState = {
  instance: undefined,
  firestore: undefined,
  loading: false,
};

export const actions: ActionTree<FirebaseState, RootState> = {
  async initFirebase({ commit }) {
    try {
      debugger;
      const fb = firebaseInstance.initializeApp(firebaseConfig);
      const fs = fb.firestore();
      commit("setFirebase", fb);
      commit("setFirestore", fs);
    } catch (error) {
      // Notifications is in progress
      //   dispatch(
      //     "notifications/error",
      //     "Failed to initialise firebase/firestore",
      //     { root: true }
      //   );
    }
  },
};

export const mutations: MutationTree<FirebaseState> = {
  setFirebase(state, payload) {
    state.instance = payload;
  },
  setFirestore(state, payload) {
    state.firestore = payload;
  },
  loading(state, payload = true) {
    state.loading = payload;
  },
};

export const getters: GetterTree<FirebaseState, RootState> = {};

const namespaced = true;

export const firebase: Module<FirebaseState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};

export default firebase;

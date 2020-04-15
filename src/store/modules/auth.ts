import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "..";

export interface AuthState {
  loggedIn: boolean;
  loading: boolean;
}

export const state: AuthState = {
  loggedIn: false,
  loading: false
};

export const actions: ActionTree<AuthState, RootState> = {
  async login({ commit, rootState }, payload) {
    try {
      commit("loading");
      if (!rootState.firebase.instance) return;
      await rootState.firebase.instance
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password);

      commit("setLogin", true);
      commit("loading", false);
    } catch (error) {
      commit("loading", false);
    }
  }
};

export const mutations: MutationTree<AuthState> = {
  setLogin(state, payload = true) {
    state.loggedIn = payload;
  },
  loading(state, payload = true) {
    state.loading = payload;
  }
};

export const getters: GetterTree<AuthState, RootState> = {
  isAuthenticated(state, getters, rootState) {
    if (!rootState.firebase.instance) return false;

    return !!rootState.firebase.instance.auth().currentUser && state.loggedIn;
  }
};

const namespaced = true;

export const auth: Module<AuthState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export default auth;

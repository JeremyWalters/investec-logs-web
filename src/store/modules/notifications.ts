import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "..";

export interface NotificationsState {
  error: string | null;
  success: string | null;
}

export const state: NotificationsState = {
  error: null,
  success: null
};

export const actions: ActionTree<NotificationsState, RootState> = {
  async error({ commit }, payload) {
    commit("setError", payload);
  },
  async success({ commit }, payload) {
    commit("setSuccess", payload);
  }
};

export const mutations: MutationTree<NotificationsState> = {
  setError(state, payload) {
    state.error = payload;
  },
  setSuccess(state, payload) {
    state.success = payload;
  }
};

export const getters: GetterTree<NotificationsState, RootState> = {};

const namespaced = true;

export const notifications: Module<NotificationsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export default notifications;

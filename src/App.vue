<template>
  <v-app id="inspire">
    <template v-if="isAuthenticated">
      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>My Investec Logs</v-toolbar-title>
      </v-app-bar>
      <NavigationDrawer :drawer.sync="drawer"></NavigationDrawer>
    </template>

    <v-content style="background-color: #eee">
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  SetupContext,
  ref,
  computed
} from "@vue/composition-api";

import NavigationDrawer from "@/components/NavigationDrawer.vue";
import { Store } from "vuex";
import { RootState } from "./store";

export default defineComponent({
  components: { NavigationDrawer },
  setup(props: unknown, context: SetupContext) {
    const store: Store<RootState> = context.root.$store;
    const drawer = ref(null);

    const isAuthenticated = computed(() => store.state.auth.loggedIn);
    onMounted(async () => {
      store.dispatch("firebase/initFirebase");
    });

    return {
      isAuthenticated,
      drawer
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

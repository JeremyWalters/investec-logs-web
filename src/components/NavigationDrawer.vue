<template>
  <v-navigation-drawer
    :mini-variant="!drawer"
    @input="$emit('update:drawer', $event)"
    app
    clipped
  >
    <v-list dense>
      <v-list-item link :to="{ name: 'Transactions' }">
        <v-list-item-action>
          <v-icon>mdi-post-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Transactions</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :to="{ name: 'Expenditure' }">
        <v-list-item-action>
          <v-icon>mdi-cash-multiple</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Expenditure</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :to="{ name: 'Tags' }">
        <v-list-item-action>
          <v-icon>mdi-tag-multiple</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Tags</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :to="{ name: 'Account Settings' }" disabled>
        <v-list-item-action>
          <v-icon disabled>mdi-cog</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    drawer: Boolean
  },
  setup() {
    return {};
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

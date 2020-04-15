<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <!-- Alert which would show any auth errors -->
            <v-alert
              type="error"
              v-model="error.show"
              dismissible
              dense
              border="bottom"
              >{{ error.message }}</v-alert
            >
            <v-form>
              <v-text-field
                label="Login"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                v-model="model.email"
              />

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="model.password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, SetupContext, reactive } from "@vue/composition-api";
export default defineComponent({
  setup(props: unknown, context: SetupContext) {
    const store = context.root.$store;
    const error = reactive({ message: "", show: false });
    const model = reactive({
      email: "",
      password: ""
    });

    async function login() {
      const errorResponse = await store.dispatch("auth/login", model);

      if (errorResponse) {
        error.message = errorResponse.message;
        error.show = true;
      }

      context.root.$router.push({ name: "Transactions" });
    }

    return {
      login,
      model,
      error
    };
  }
});
</script>

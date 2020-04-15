import Vue from "vue";
import VueRouter from "vue-router";
import { store } from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Transactions",
    component: () =>
      import(
        /* webpackChunkName: "transactions" */ "../views/transactions/Transactions.vue"
      )
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Login.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

router.beforeEach(async (to, from, next) => {
  if (to.name === "Login") next();
  else if (!store.state.auth.loggedIn) next("/login");
  else next();
});

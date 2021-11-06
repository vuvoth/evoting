import { createRouter, createWebHistory } from "vue-router";
import Vote from "../views/Vote.vue";
import CreateSesion from "../views/CreateSession.vue";
import Connect from "../views/Connect.vue";
const routes = [
  {
    path: "/vote",
    name: "Vote",
    component: Vote,
  },
  {
    path: "/connect",
    name: "Connect",
    component: Connect,
  },
  {
    path: "/create",
    name: "Create",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: CreateSesion,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import FlatMaps from '../views/FlatMaps.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview
    },
    {
      path: '/flatmaps',
      name: 'flatmaps',
      component: FlatMaps
    }
  ]
})

export default router

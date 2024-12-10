//==============================================================================

import { createRouter, createMemoryHistory } from 'vue-router'

import Overview from '@/views/Overview.vue'
import Flatmaps from '@/views/Flatmaps.vue'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview
    },
    {
      path: '/flatmaps',
      name: 'flatmaps',
      component: Flatmaps
    }
  ]
})

export default router

//==============================================================================

//==============================================================================

import { createRouter, createMemoryHistory } from 'vue-router'

import Overview from '@/views/Overview.vue'
import Flatmaps from '@/views/Flatmaps.vue'
//import FlatmapInfoView from '@/views/FlatmapInfoView.vue'

//==============================================================================

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
/*    },
    {
      path: '/flatmap/info/:server/:id',
      name: 'flatmapInfo',
      component: FlatmapInfoView,
      props: true
*/    }
  ]
})

export default router

//==============================================================================

import {reactive} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import {useMainStore} from './store'

import Flatmaps from './views/flatmaps.vue'
import Overview from './views/overview.vue'

// The loading state of Vue Router is appended to $router, so a
// spinner can be shown while loading. This status needs to be reactive, it is
// set to true on beforeRoute and false on afterRoute.
const status = reactive({ loading: true })

const routes = [
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


// Is there a Typescript friendly way to define status??
Object.defineProperty(router, 'status', {
  get: () => status,
  set: value => (status.loading = value)
})

router.beforeEach((_to, _from, next) => {
  // Update through the property observer for reactivity.
//  router.status = true
  next()
})

router.afterEach(() => {
//  router.status = false
  setTimeout(() => {
    const pageTitle = (document.querySelector('h1') || {}).innerText?.replace(/[#\n]|IN PROGRESS/g, '') || ''
    document.title = pageTitle
    // After route change, update the title of the page to pass it to Codepen from examples.
    const store = useMainStore()
    store.currentPage = pageTitle
  }, 200)
})

export default router

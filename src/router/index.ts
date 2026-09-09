import { createRouter, createWebHistory } from 'vue-router'
import UnitListView from '../views/UnitListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'unit-list',
      component: UnitListView,
    },
    {
      path: '/units/:id',
      name: 'unit-detail',
      // Unit Detail is not implemented yet; this route only supports navigation from the list.
      component: () => import('../views/UnitDetailView.vue'),
      props: true,
    },
  ],
})

export default router

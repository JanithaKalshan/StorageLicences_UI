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
      component: () => import('../views/UnitDetailView.vue'),
      props: true,
    },
  ],
})

export default router

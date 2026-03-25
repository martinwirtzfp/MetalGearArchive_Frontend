import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/menu'
  },
  {
    path: '/menu',
    component: () => import('@/views/MainMenuPage.vue')
  },
  {
    path: '/personajes',
    component: () => import('@/views/Tab1Page.vue')
  },
  {
    path: '/personajes/:id',
    component: () => import('@/views/CharacterDetailPage.vue')
  },
  {
    path: '/juegos',
    component: () => import('@/views/Tab2Page.vue')
  },
  {
    path: '/juegos/:id',
    component: () => import('@/views/GameDetailPage.vue')
  },
  {
    path: '/eventos',
    component: () => import('@/views/Tab3Page.vue')
  },
  {
    path: '/eventos/:id',
    component: () => import('@/views/EventDetailPage.vue')
  },
  {
    path: '/lugares',
    component: () => import('@/views/LocationsPage.vue')
  },
  {
    path: '/lugares/:id',
    component: () => import('@/views/LocationDetailPage.vue')
  },
  {
    path: '/organizaciones',
    component: () => import('@/views/OrganizationsPage.vue')
  },
  {
    path: '/organizaciones/:id',
    component: () => import('@/views/OrganizationDetailPage.vue')
  },
  {
    path: '/tabs/tab1',
    redirect: '/personajes'
  },
  {
    path: '/tabs/tab2',
    redirect: '/juegos'
  },
  {
    path: '/tabs/tab3',
    redirect: '/eventos'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

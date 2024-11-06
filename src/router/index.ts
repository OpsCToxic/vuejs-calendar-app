import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserAccount from '../views/UserAccount.vue'

const routes = [
  { path: '/', redirect: '/signin' },
  { path: '/signin', component: UserAccount },
  { path: '/home', component: HomeView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

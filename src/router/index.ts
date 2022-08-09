import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/productos',
    name: 'Productos',
    component: () => import('@/views/Productos.vue'),
    
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router

import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home/',
    name: 'Home',
    props: true,
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/sucursales',
    name: 'Sucursales',
    props:true,
    component: () => import('@/views/Sucursales.vue'),
    
  },
  {
    path: '/home/:sucursal',
    name: 'Homep',
    props:true,
    component: () => import('@/views/Home.vue'),    
  },

  {
    path: '/productos',
    name: 'productos',
    props:true,
    component: () => import('@/views/Productos.vue'),    
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router

//API_URL = "http://localhost:3164/api";

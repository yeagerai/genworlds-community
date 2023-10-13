import { createRouter, createWebHistory } from 'vue-router';
import WorldLayout from './components/WorldLayout.vue';

const routes = [
    {
      path: '/',
      name: 'WorldLayout',
      component: WorldLayout,
    },    
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

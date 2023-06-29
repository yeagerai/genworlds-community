import { createRouter, createWebHistory } from 'vue-router';
import UseCaseGallery from './components/UseCaseGallery.vue';
import UseCaseView from './components/UseCaseView.vue';

const routes = [
    {
      path: '/',
      name: 'useCaseGallery',
      component: UseCaseGallery,
    },
    {
      path: '/use-case/:slug',
      name: 'useCaseView',
      component: UseCaseView,
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

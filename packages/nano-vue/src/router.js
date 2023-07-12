import { createRouter, createWebHistory } from 'vue-router';
import UseCaseGallery from './components/UseCaseGallery.vue';
import UseCaseView from './components/UseCaseView.vue';
import PleaseFork from './components/PleaseFork.vue';

const defaultRedirectPath = process.env.VUE_APP_USE_CASE_ACCESS_POINT ? process.env.VUE_APP_USE_CASE_ACCESS_POINT : '/home';
console.log('VUE_APP_USE_CASE_ACCESS_POINT:', process.env.VUE_APP_USE_CASE_ACCESS_POINT);

const routes = [
    {
      path: '/',
      redirect: defaultRedirectPath,
    },
    {
      path: '/please-fork-me',
      component: PleaseFork,
    },
    {
      path: '/use-case/:use_case/:world_definition',
      name: 'useCaseView',
      component: UseCaseView,
      props: true,
    },
    {
      path: '/home',
      name: 'useCaseGallery',
      component: UseCaseGallery,
      children: [
        {
          path: '/use-case/:use_case/:world_definition',
          name: 'useCaseView',
          component: UseCaseView,
          props: true,
        },
      ]
    },
    
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

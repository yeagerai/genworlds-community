import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './tailwind.css';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(router).use(pinia).mount('#app');
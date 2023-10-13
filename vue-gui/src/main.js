import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './tailwind.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(router).use(pinia).mount('#app');
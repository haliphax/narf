import App from './components/app.vue';
import { createApp } from 'vue';
import router from './router';
import store from './store/index';

(globalThis as any).__VUE_OPTIONS_API__ = true;
(globalThis as any).__VUE_PROD_DEVTOOLS__ = false;

const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app');

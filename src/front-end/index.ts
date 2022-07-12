import App from './app.vue';
import { createApp } from 'vue';
import store from './store/index';

(globalThis as any).__VUE_OPTIONS_API__ = true;
(globalThis as any).__VUE_PROD_DEVTOOLS__ = false;

store.commit('story.title', 'Testing this thing');
store.commit(
  'participants.people',
  {
    'a': { id: 'a', name: 'Somebody', value: '8' },
    'b': { id: 'b', name: 'Anybody', value: '8' },
    'c': { id: 'c', name: 'Anakin', value: '8' },
    'd': { id: 'd', name: 'Padmei', value: '1/2' },
    'e': { id: 'e', name: 'Jar-jar', value: '1' },
  });

const app = createApp(App);

app.use(store);
app.mount('#app');

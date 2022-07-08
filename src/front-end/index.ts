import App from './app.vue';
import { createApp } from 'vue';
import store from './store/index';

store.commit(
  'participants',
  [
    { name: 'chovies' },
    { name: 'sweeps' },
    { name: 'foohon' },
  ]);
store.commit('storyTitle', 'Testing this thing');

const app = createApp(App);

app.use(store);
app.mount('#app');

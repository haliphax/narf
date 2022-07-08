import App from './app.vue';
import { createApp } from 'vue';
import store from './store/index';

store.commit('story.title', 'Testing this thing');
store.commit('participants.people', {'a': { id: 'a', name: 'Somebody' }})

const app = createApp(App);

app.use(store);
app.mount('#app');

import { createApp } from "vue";
import App from "./app.vue";
import router from "./router";
import store from "./store/index";

const app = createApp(App as unknown as App.Component);
app.use(router);
app.use(store);
app.mount("#🖥️");

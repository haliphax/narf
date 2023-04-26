import { createApp } from "vue";
import App from "./components/app.vue";
import router from "./router";
import store from "./store/index";

(globalThis as any).__VUE_OPTIONS_API__ = true;
(globalThis as any).__VUE_PROD_DEVTOOLS__ = !!process.env.DEBUG;

const app = createApp(App as unknown as App.Component);

app.use(router);
app.use(store);
app.mount("#app");

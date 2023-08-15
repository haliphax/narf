import { createApp } from "vue";
import App from "./app.vue";
import router from "./router";
import store from "./store/index";

interface VueOptions {
	__VUE_OPTIONS_API__: boolean;
	__VUE_PROD_DEVTOOLS__: boolean;
}

const opts = globalThis as unknown as VueOptions;
opts.__VUE_OPTIONS_API__ = true;
opts.__VUE_PROD_DEVTOOLS__ = !!process.env.DEBUG;

const app = createApp(App as unknown as App.Component);
app.use(router);
app.use(store);
app.mount("#app");

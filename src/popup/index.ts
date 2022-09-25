import Vue from "vue";
import AppComponent from "./App/App.vue";
import { Button, Input } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Button);
Vue.use(Input);
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});

window.chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  sendResponse({
      data: "I am fine, thank you. How is life in the background?"
  }); 
});
<template>
  <div class="main_app">
    <h1>Hello content</h1>
  </div>
</template>

<script lang="ts">
import { Message, MessageBox } from "element-ui";

export default {
  name: "app",
  mounted() {
    MessageBox.alert("这是一段内容", "标题名称", {
      confirmButtonText: "确定",
      callback: (action) => {
        Message({
          type: "info",
          message: `action: ${action}`,
        });
      },
    });
  },
};
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

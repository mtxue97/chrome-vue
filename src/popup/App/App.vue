<template>
  <div class="main-page">
    <h1>Hello popup</h1>
    <el-input v-model="prefix" placeholder="请输入词条前缀"></el-input>
    <el-button type="primary" @click="download">导出</el-button>
  </div>
</template>

<script lang="ts">
export default {
  name: "app",
  data() {
    return {
      prefix: "",
    };
  },
  mounted() {
  },
  methods: {
    test() {
      console.log(111);
      var bg = window.chrome.extension.getBackgroundPage();
      bg.test();
    },
    download() {
      let key = `${this.prefix}.key`;
      let str = JSON.stringify({
        [key]: "hahaha",
      });
      window.chrome.downloads.download(
        {
          url: "data:," + str,
          // url: "data:,Hello%2C%20World!",
          filename: "test.yml",
          conflictAction: "uniquify",
        },
        function (id) {
          console.log(id)
        }
      );
    },
  },
};
</script>

<style>
.main-page {
  width: 500px;
  color: red;
  border-radius: 8px;
}
.el-button {
  margin-top: 20px;
}
</style>

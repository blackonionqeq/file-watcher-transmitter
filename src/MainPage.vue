<template>
  <!-- Test MainPage.vue SDF
  <Button>Test</Button> -->
  <div class="wrapper">
    <Button type="primary" class="item" @click="openNewWatchFlow">新建文件监听流程</Button>
    <Button class="item" @click="closeAll">关闭所有文件监听流程</Button>
    <Button class="item" @click="closeAllAndReturn">关闭并退出</Button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Button, } from 'ant-design-vue'
import 'ant-design-vue/lib/button/style'

onMounted(() => {
  console.log('on mounted')
  
  // 注册body监听图片流程

  const body = document.body
  /** @param {DragEvent} e */
  body.ondragover = (e) => {
    e.stopPropagation()
    e.preventDefault()
    // TODO:增加拖拽效果
  }
  /**
   * 
   * @param {DragEvent} e 
   */
  body.ondrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files;
    const imgFile = [...files].find(i => i.type.startsWith('image/'))
    if (imgFile) {
      console.log(imgFile)
      console.log(imgFile.path)
      window.utils.dropImage(imgFile.path)
    }
  }
})

async function openNewWatchFlow() {
  const filePath = await window.utils['select-file']()
  console.log(filePath)
}

function closeAll() {
  window.utils.closeAll()
}

function closeAllAndReturn() {
  window.utils.closeAllAndReturn()
}
</script>

<style scoped>
ul {
  padding: 0;
  list-style-type: none;
  margin: 0;
}
/* html, body {
  height: 100%;
} */
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.item {
  flex: 1;
  width: 90%;
  margin: 12px;
  font-size: 24px;
}
</style>
<template>
  <div class="container" :style="{ backgroundColor, height: '100%', }">
    <div class="tip" v-if="filePath">
      <div class="title">文件监听状态</div>
      <div class="value over-text">正在监听{{ filePath }}</div>
    </div>

    <div class="tip">
      <div class="title">
        端口号
      </div>
      <div class="value">
        {{ port }}
      </div>
      <div class="operation">
        <Button :disabled="!filePath" type="primary" @click="copyPort">复制端口号</Button>
      </div>
    </div>

    <div class="tip">
      <div class="title">连接状态</div>
      <div class="value">
        {{ isLinked ? '已建立连接' : '等待建立和浏览器的链接' }}
      </div>
      <div class="operation">
        <Button @click="quit">退出监听</Button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, } from 'vue';
import { Button, } from 'ant-design-vue'
import 'ant-design-vue/lib/button/style'
// import 'ant-design-vue/lib/form/style'

const isLinked = ref(false)
const filePath = ref('')

const backgroundColor = ref('skyblue')

const port = ref(0)

onMounted(async () => {
  if (window.bridge) {
    window.bridge.onRegistratWS(() => {
      backgroundColor.value = 'lightgreen'
      isLinked.value = true
    })

    window.bridge.onWatchFileByPath((path) => {
      filePath.value = path
      const name = path.split('\\').at(-1)
      document.title = `${name}`
    })

    /** @type {number} */
    const _port = await window.bridge.startGetPort()
    console.log(_port)
    port.value = _port
  }
})

function copyPort() {
  window.bridge.copyText(port.value)
}
function quit() {
  window.bridge.quit()
}
</script>

<style scoped>
.tip {
  line-height: 3;
  display: flex;
  flex: 1;
  font-size: 20px;
  .title {
    width: 140px;
    font-weight: 700;
    display: flex;
    justify-content: end;
  }
  .value {
    flex: 1;
    margin-left: 20px;
  }
  .over-text {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 460px;
    white-space: nowrap;
    word-break: normal;
    -webkit-line-clamp: 1;
  }
  .operation {
    display: flex;
    align-items: center;
    /* flex: 1; */
    justify-content: end;
  }
}
.container {
  padding: 20px 42px;
  overflow: hidden;
}
</style>
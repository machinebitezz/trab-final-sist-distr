<script setup lang="ts">
import ShipGrid from './components/ShipGrid.vue';

function test() {
  window.electron.makeRequest('getMethods', [] )
  console.log(`aki`)
}

window.electron.onMessageRecieved((_, msg) => {
  console.log(msg)
})

const testGrid = [
  [1, 2, 3, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
]
</script>

<template>
  <div>
    <ShipGrid 
      :grid="testGrid"
    />

    <button @click="test">
      oi
    </button>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
</style>
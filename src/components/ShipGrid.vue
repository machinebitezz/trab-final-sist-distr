<script setup lang="ts">
  defineProps<{
    grid: number[][]
  }>()
</script>

<template>
  <div>
    <div class="row" v-for="(row, index) in grid" :key="index">
      <span :class="`square type-${col}`" v-for="(col, index) in row" :key="index" />
    </div>
  </div>
</template>

<style>
.row {
  margin: 0;
  padding: 0;
  height: 40px;
}

.square {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: #dfdfdf;
  border: 1px solid black;
}

.type-0 {
  background-color: #dfdfdf;
}

.type-1 {
  background-color: #c73230;
}

.type-2 {
  background-color: #32a852;
}

.type-3 {
  background-color: #51a9e8;
}
</style>
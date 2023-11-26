<script setup lang="ts">
import { PlacingInfo } from './types'

defineProps<{
  grid: string[][]
  placing?: PlacingInfo
}>()

const $emit = defineEmits(['click'])

function handleClick(event: { i: number, j: number }) {
  $emit('click', event)
}
</script>

<template>
  <div>
    <span class="letter" v-for="i in grid.length">
      {{ String.fromCharCode(96 + i).toUpperCase() }}
    </span>
    <div class="row" v-for="(row, i) in grid" :key="i">
      <span class="number">{{ i + 1 }}</span>
      <span 
        :class="`square type-${col}`"
        :key="j" 
        v-for="(col, j) in row"
        @click="handleClick({
          i,
          j
        })"
      />
    </div>
  </div>
</template>

<style scoped>
.row {
  margin: 0;
  padding: 0;
  height: 40px;
}

.letter {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 1px solid #00000050;
  position: relative;
  left: 20px;
}

.number {
  display: inline-block;
  height: 40px;
  width: 40px;
  border: 1px solid #00000050;
  position: relative;
  top: -20px;
  padding: 2px 4px;
}

.square {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 1px solid black;
  background-size: contain;
}

.type-water {
  background-image: url('/water.jpg');
}

.type-miss {
  background-image: url('/splash.png'), url('/water.jpg');
  
}

.type-hit {
  background-image: url('/explosion.png'), url('/water.jpg');
}

.type-ship {
  background-color: #747a86
}

.type-hit-ship {
  background-image: url('/explosion.png');
  background-color: #747a86;
}
</style>
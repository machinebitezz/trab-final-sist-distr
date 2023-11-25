<script setup lang="ts">
import { ShipInfo, type ship } from './types'
defineEmits(['select'])

defineProps<{
  shipInfo: ShipInfo
}>()

const ships: ship[] = ['carrier', 'battleship', 'cruiser', 'submarine']
</script>

<template>
  <div class="button-grid">
    <button
      v-for="ship in ships"
      @click="$emit('select', ship)"
    >
      <div>
        {{ shipInfo[ship].name }}
      </div>

      <div>
        Tamanho: {{ shipInfo[ship].size }}
      </div>

      <div>
        Disponíveis: {{ shipInfo[ship].left }}/{{ shipInfo[ship].max }}
      </div>
    </button>

    <button
      @click="$emit('select', 'nothing')"
    >
      <div>
        Cancelar
      </div>  
    </button>
  </div>
</template>

<style scoped>
.button-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

button > div {
  margin-bottom: 3px;
  margin-top: 3px;
}
</style>
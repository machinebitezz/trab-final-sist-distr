<script setup lang="ts">
import { ref } from 'vue'
import ShipGrid from './components/ShipGrid.vue'
import ShipSelector from './components/ShipSelector.vue'
import { ship, PlacingInfo } from './components/types'

// peparar as grades
const boardSize = 9
const row = Array(boardSize).fill('water')
const playerGrid = ref(Array(boardSize).fill([]))
const enemyGrid = ref(Array(boardSize).fill([]))

playerGrid.value.forEach((_, index) => {
  playerGrid.value[index] = row.map(x => x)
  enemyGrid.value[index] = row.map(x => x)
})

// informação de posicionamento
const placing = ref<PlacingInfo>({
  piece: 'nothing',
  vertical: false
})

// conversão
const shipInfo = ref({
  carrier: {
    name: 'Porta-Aviões',
    size: 5,
    max: 1,
    left: 1
  },
  battleship: {
    name: 'Navio-Tanque',
    size: 4,
    max: 1,
    left: 1
  },
  cruiser: {
    name: 'Contratorpedeiro',
    size: 3,
    max: 2,
    left: 2
  },
  submarine: {
    name: 'Submarino',
    size: 2,
    max: 3,
    left: 3
  },
  nothing: {
    name: 'Nada',
    size: 0,
    max: 0,
    left: 0
  },
})

// event handlers
function handleSelection(ship: ship) {
  // se cancelar, resetar
  if (ship === 'nothing') {
    placing.value.vertical = false
    placing.value.piece = 'nothing'
    return
  }

  // se clicar de novo no mesmo Embarcação, girar
  if (ship === placing.value.piece) {
    placing.value.vertical = !placing.value.vertical

  // mudar Embarcação
  } else {
    placing.value.vertical = false
    placing.value.piece = ship
  }
}

function handlePlace({i, j}: { i: number, j: number }) {
  const vertical = placing.value.vertical
  const shipSize = shipInfo.value[placing.value.piece].size

  // checa se a seleção  está em 'nothing'
  if (placing.value.piece === 'nothing') {
    return
  }
  
  // checa se ainda existem Embarcaçãos disponíveis
  if (shipInfo.value[placing.value.piece].left === 0) {
    alert('Não possui mais este tipo de embarcação disponível')
    return
  }

  // checar se não vai extrapolar o tamanho da grade
  const toCheck = vertical ? i : j
  if ((toCheck + shipSize) > boardSize) {
    alert('Embarcação maior que o tabuleiro')
    return
  } 

  // checar se não existe outra embarcação em uma das posições do novo
  for (let index = 0; index < shipSize; index++) {
    if (vertical) {
      if (playerGrid.value[i + index][j] === 'ship') {
        alert('Embarcações não podem se sobrepor')
        return 
      }
    } else {
      if (playerGrid.value[i][j + index] === 'ship') {
        alert('Embarcações não podem se sobrepor')
        return 
      }
    }
  }

  // posicionar a embarcação
  for (let index = 0; index < shipSize; index++) {
    if (vertical) {
      playerGrid.value[i + index][j] = 'ship'
    } else {
      playerGrid.value[i][j + index] = 'ship'
    }
  }

  shipInfo.value[placing.value.piece].left -= 1
}

function handleGuess({i, j}: { i: number, j: number }) {
  if (enemyGrid.value[i][j] === 'water') {
    window.electron.makeRequest('guess', [i, j])
  }
}

// lógica de mensagem
window.electron.onMessageRecieved((_, msg) => {
  if (msg.type === 'REQUEST') {
    if (msg.payload.method === 'guess') {
      const [i, j] = msg.payload.args
      const hit = playerGrid.value[i][j] === 'ship'

      playerGrid.value[i][j] = hit ? 'hit-ship' : 'miss'

      window.electron.sendResponse(false, 'guess', {
        coords: [i, j],
        result: hit
      })
    }
  } else if (msg.type === 'RESPONSE' && !msg.payload.failed) {
    if (msg.payload.responseTo === 'guess') {
      const [i, j] = msg.payload.message.coords

      enemyGrid.value[i][j] = msg.payload.message.result ? 'hit' : 'miss'
    }
  } else {
    alert('oops')
  }
})
</script>

<template>
  <div>
    <div>
      Posicionando: {{ shipInfo[placing.piece].name }}
      <span v-show="placing.piece !== 'nothing'">
        ({{ placing.vertical ? 'Vertical' : 'Horizontal' }})
      </span>
    </div>

    <div class="playfield">
      <ShipGrid 
        :placing="placing"
        :grid="playerGrid"
        @click="handlePlace($event)"
      />

      <ShipGrid
        :grid="enemyGrid"
        @click="handleGuess($event)"
      />
    </div>

    <div>
      <ShipSelector
        :shipInfo="shipInfo"
        @select="handleSelection($event)"
      />
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
</style>

<style scoped>
.playfield {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  margin-top: 10px;
}
</style>
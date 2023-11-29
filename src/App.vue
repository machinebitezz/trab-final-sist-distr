<script setup lang="ts">
import { ref } from 'vue'
import ShipGrid from './components/ShipGrid.vue'
import ShipSelector from './components/ShipSelector.vue'
import { ship, PlacingInfo } from './components/types'

// peparar as grades
const boardSize = 9
const row = Array(boardSize).fill('water')
const playerGrid = ref<string[][]>(Array(boardSize).fill([]))
const enemyGrid = ref<string[][]>(Array(boardSize).fill([]))
const playerTurn = ref<boolean | null>(null)

let hits = 0

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

  if (allPlaced()) {
    window.electron.makeRequest('check-done', [])
  }
}

function allPlaced() {
  return Object.keys(shipInfo.value).reduce((acc, _ship) => {
    const ship = shipInfo.value[(_ship as ship)]

    return ship.left === 0 && acc
  }, true)
}

function handleGuess({i, j}: { i: number, j: number }) {
  if (!playerTurn.value) {
    alert('Não é a sua vez de jogar')
    return
  }

  if (enemyGrid.value[i][j] === 'water') {
    window.electron.makeRequest('guess', [i, j])
    playerTurn.value = false
  }
}

// lógica de mensagem
window.electron.onRequestRecieved('guess', (msg, respond) => {
  if (allPlaced()) {
    const [i, j] = msg.payload.args
    const hit = playerGrid.value[i][j] === 'ship'

    playerGrid.value[i][j] = hit ? 'hit-ship' : 'miss'

    respond(false, {
      coords: [i, j],
      result: hit
    })

    playerTurn.value = true
  } else {
    respond(true, '')
  }
})

window.electron.onRequestRecieved('check-win', (msg, respond) => {
  let allSunk = 0

  playerGrid.value.forEach((row) => {
    row.forEach((tile) => {
      if (tile === 'hit-ship') {
        allSunk += 1
      }
    })
  })

  const won = allSunk === 21

  respond(false, won)

  if (won) {
    alert('Você perdeu')
    window.location.reload()
  }
})

window.electron.onRequestRecieved('check-done', (msg, respond) => {
  respond(false, allPlaced())
})

window.electron.onResponseRecieved('guess', (msg) => {
  if (msg.payload.failed) {
    alert('Seu oponente ainda não terminou de posicionar as peças')
    return
  }

  const [i, j] = msg.payload.message.coords
  const hit = msg.payload.message.result

  if (hit) {
    hits += 1

    if (hits === 21) {
      window.electron.makeRequest('check-win', [])
    }
  }

  enemyGrid.value[i][j] = hit ? 'hit' : 'miss'
})

window.electron.onResponseRecieved('check-win', (msg) => {
  if (msg.payload.message) {
    alert('Você Ganhou')
    window.location.reload()
  }
})

window.electron.onResponseRecieved('check-done', (msg) => {
  if (!msg.payload.message) {
    alert('Você terminou de montar o tabuleiro primeiro e será o primeiro a jogar')
    playerTurn.value = true
  } else {
    alert('Você não terminou de montar o tabuleiro em primeiro e será o segundo a jogar')
    playerTurn.value = false
  }
})

window.electron.onTimeout(() => {
  alert('A conexão com seu oponente foi interrompida. A aplicação será reiniciada')
  window.location.reload()
})

</script>

<template>
  <div>
    <template v-if="playerTurn !== null">
      <div>
        {{ playerTurn ? 'É a sua vez' : 'É a vez do seu oponente' }}
      </div>
    </template>
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
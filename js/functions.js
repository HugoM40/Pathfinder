const sectionAttack = document.getElementById("seleccionA");
const sectionReload = document.getElementById("reiniciar");
const monstruo = document.getElementById("boton-monstruo");
const botonReiniciar = document.getElementById("boton-reiniciar");
const sectionMonster = document.getElementById("seleccionM");
const nombreMonstruo = document.getElementById("nameMonstruo");
const monstruovidasE = document.getElementById("vidasEnemigos");
const monstruovidasJ = document.getElementById("vidasJugador");
const mensajeC = document.getElementById("resultado");
const ataquesJugador = document.getElementById("ataquesJugador");
const ataquesEnemigo = document.getElementById("ataquesEnemigo");
const containerCar = document.getElementById("containerCarBox");
const containerAtaques = document.getElementById("containerAtaques");
const lookMap = document.getElementById("lookMap");
const map = document.getElementById("map");

let jugadorId = null;
let enemigoId = null;
let optionsMonster;
let hipoge;
let monsterPlayer;
let ataquesMonstruo;
let capipepo;
let ratigueya;
let ataquesMonstruoE;
let indexAtaqueE;
let indexAtaqueJ;
let monstruoObjeto;
let alturaMapa;
let anchoMapa = window.innerWidth - 20;
let ataqueE = [];
let attackPlayer = [];
let arrayMonster = [];
let monstruosEnemigos = [];
let botones = [];
let victoriasJ = 0;
let victoriasE = 0;
let lienzo = map.getContext("2d");
let intervalo;
let mapaCampo = new Image();
mapaCampo.src = "./resources/img/4.png";

const limiteMapa = 450

if (anchoMapa > limiteMapa) {
  anchoMapa = limiteMapa -20
}
alturaMapa = anchoMapa * 600 / 800

map.width = anchoMapa
map.height = alturaMapa

class Pathfinder {
  constructor(name, foto, lives, fotoMapa, id = null) {
    this.id = id;
    this.name = name;
    this.foto = foto;
    this.lives = lives;
    this.attacks = [];
    this.ancho = 40;
    this.alto = 40;
    this.x = aleatorio(0, map.width - this.ancho);
    this.y = aleatorio(0, map.height - this.alto);
    this.mapaFoto = new Image();
    this.mapaFoto.src = fotoMapa;
    this.velocidadX = 0;
    this.velocidadY = 0;
  }

  pintarMonstruo() {
    lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
  }
}

let nameMonster1 = new Pathfinder(
  "Hipoge",
  "./resources/img/1.png",
  5,
  "./resources/img/11.png"
);

let nameMonster2 = new Pathfinder(
  "Capipepo",
  "./resources/img/2.png",
  5,
  "./resources/img/22.png"
);

let nameMonster3 = new Pathfinder(
  "Ratigueya",
  "./resources/img/3.png",
  5,
  "./resources/img/33.png"
);

const monster1Attacks = [
{ nombre: "🌱", id: "botonTierra" },
{ nombre: "🌱", id: "botonTierra" },
{ nombre: "🌱", id: "botonTierra" },
{ nombre: "💧", id: "botonAgua" },
{ nombre: "🔥", id: "botonFuego" },
]

nameMonster1.attacks.push(...monster1Attacks);

const monster2Attacks = [
  { nombre: "💧", id: "botonAgua" },
  { nombre: "💧", id: "botonAgua" },
  { nombre: "💧", id: "botonAgua" },
  { nombre: "🔥", id: "botonFuego" },
  { nombre: "🌱", id: "botonTierra" },
]

nameMonster2.attacks.push(...monster2Attacks);

const monster3Attacks = [
  { nombre: "🔥", id: "botonFuego" },
  { nombre: "🔥", id: "botonFuego" },
  { nombre: "🔥", id: "botonFuego" },
  { nombre: "🌱", id: "botonTierra" },
  { nombre: "💧", id: "botonAgua" },
]

nameMonster3.attacks.push(...monster3Attacks);

arrayMonster.push(nameMonster1, nameMonster2, nameMonster3);

function iniciarJuego() {
  sectionAttack.style.display = "none";
  sectionReload.style.display = "none";
  lookMap.style.display = "none";
  arrayMonster.forEach((monster) => {
    optionsMonster = `
        <input type="radio" name="monstruos" id=${monster.name} />
        <label class="tarjeta-mokepon" for=${monster.name}>
            <p>${monster.name}</p>
            <img src=${monster.foto} alt=${monster.name}>
        </label>`;
    containerCar.innerHTML += optionsMonster;

    hipoge = document.getElementById("Hipoge");
    capipepo = document.getElementById("Capipepo");
    ratigueya = document.getElementById("Ratigueya");
  });
  monstruo.addEventListener("click", seleccionarMonstruoJ);
  botonReiniciar.addEventListener("click", reinicarJ);
  unirseJuego()
}

function unirseJuego() {
  fetch("http://192.168.1.5:8080/unirse")
    .then(function (res) {
      if (res.ok) {
        res.text()
            .then(function (respuesta) {
              console.log(respuesta);
              jugadorId = respuesta
            })
      }
    })
}

function seleccionarMonstruoJ() {
  if (hipoge.checked) {
    nombreMonstruo.innerHTML = hipoge.id;
    monsterPlayer = hipoge.id;
  } else if (capipepo.checked) {
    nombreMonstruo.innerHTML = capipepo.id;
    monsterPlayer = capipepo.id;
  } else if (ratigueya.checked) {
    nombreMonstruo.innerHTML = ratigueya.id;
    monsterPlayer = ratigueya.id;
  } else {
    alert("Selecciona un monstruo Por Favor, Reinicia el juego " );
    return
  }
  sectionMonster.style.display = "none";
  sectionReload.style.display = "none";
  lookMap.style.display = "flex";
  extraerAtaques(monsterPlayer);
  selectMonster(monsterPlayer);
  iniciarMapa();
}

function selectMonster(monsterPlayer) {
  fetch(`http://192.168.1.5:8080/pathfinder/${jugadorId}`,{
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pathfinder: monsterPlayer
    })
  })
  
}

function extraerAtaques(monsterPlayer) {
  let ataques;
  for (let i = 0; i < arrayMonster.length; i++) {
    if (monsterPlayer === arrayMonster[i].name) {
      ataques = arrayMonster[i].attacks;
    }
  }
  mostrarAtaques(ataques);
}

function mostrarAtaques(ataques) {
  ataques.forEach((ataque) => {
    ataquesMonstruo = `<button id=${ataque.id} class="ataques BAtaque">${ataque.nombre}</button>`;
    containerAtaques.innerHTML += ataquesMonstruo;
  });

  botones = document.querySelectorAll(".BAtaque");
}
function secuenciaAtaques() {
  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      if (e.target.textContent === "🔥") {
        attackPlayer.push("FUEGO");
        boton.style.background = "#100F0F";
        boton.disabled = true;
      } else if (e.target.textContent === "💧") {
        attackPlayer.push("AGUA");
        boton.style.background = "#100F0F";
        boton.disabled = true;
      } else {
        attackPlayer.push("TIERRA");
        boton.style.background = "#100F0F";
        boton.disabled = true;
      }
      if (attackPlayer.length === 5) {
        enviarAtaques()
      }
    });
  });
}

function enviarAtaques() {
  fetch(`http://192.168.1.5:8080/pathfinder/${jugadorId}/ataques`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ataques: attackPlayer
    })
  })

  intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
  fetch(`http://192.168.1.5:8080/pathfinder/${enemigoId}/ataques`)
    .then(function (res) {
      if (res.ok) {
            res.json()
              .then(function ({ ataques }) {
                if (ataques.length === 5){
                  ataqueE = ataques
                  combate()
                }
            })
      }
    })
}
 
function seleccionarMonstruoN(enemigo) {
  enemigoMonstruo.innerHTML = enemigo.name;
  ataquesMonstruoE = enemigo.attacks;
  secuenciaAtaques();
}

function ataqueMenemigo() {
  let ataqueAe = aleatorio(0, ataquesMonstruoE.length - 1);

  if (ataqueAe == 0 || ataqueAe == 1) {
    ataqueE.push("FUEGO");
  } else if (ataqueAe == 3 || ataqueAe == 4) {
    ataqueE.push("AGUA");
  } else {
    ataqueE.push("TIERRA");
  }
  iniciarCombate();
}

function iniciarCombate() {
  if (attackPlayer.length === 5) {
    combate();
  }
}

function indexOponentes(jugador, enemigo) {
  indexAtaqueJ = attackPlayer[jugador];
  indexAtaqueE = ataqueE[enemigo];
}

function combate() {
  clearInterval(intervalo)
  for (let index = 0; index < attackPlayer.length; index++) {
    if (attackPlayer[index] === ataqueE[index]) {
      indexOponentes(index, index);
      crearMensaje("EMPATE");
    } else if (attackPlayer[index] === "FUEGO" && ataqueE[index] === "TIERRA") {
      indexOponentes(index, index);
      crearMensaje("GANASTE");
      victoriasJ++;
      monstruovidasJ.innerHTML = victoriasJ;
    } else if (attackPlayer[index] === "AGUA" && ataqueE[index] === "FUEGO") {
      indexOponentes(index, index);
      crearMensaje("GANASTE");
      victoriasJ++;
      monstruovidasJ.innerHTML = victoriasJ;
    } else if (attackPlayer[index] === "TIERRA" && ataqueE[index] === "AGUA") {
      indexOponentes(index, index);
      crearMensaje("GANASTE");
      victoriasJ++;
      monstruovidasJ.innerHTML = victoriasJ;
    } else {
      indexOponentes(index, index);
      crearMensaje("PERDISTE");
      victoriasE++;
      monstruovidasE.innerHTML = victoriasE;
    }
  }
  finalCombate();
}

function finalCombate() {
  if (victoriasJ === victoriasE) {
    mensajeFinal("EMPATE :/ ");
  } else if (victoriasJ > victoriasE) {
    mensajeFinal("GANASTE :)");
  } else {
    mensajeFinal("PERDISTE :(");
  }
}

function crearMensaje(resultado) {
  let newAtaquesJugador = document.createElement("p");
  let newAtaquesEnemigo = document.createElement("p");

  mensajeC.innerHTML = resultado;

  newAtaquesJugador.innerHTML = indexAtaqueJ;
  newAtaquesEnemigo.innerHTML = indexAtaqueE;

  ataquesJugador.appendChild(newAtaquesJugador);
  ataquesEnemigo.appendChild(newAtaquesEnemigo);
}

function mensajeFinal(result) {
  mensajeC.innerHTML = result;
  sectionReload.style.display = "block";
}

function reinicarJ() {
  location.reload();
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarMapa() {
  monstruoObjeto.x = monstruoObjeto.x + monstruoObjeto.velocidadX;
  monstruoObjeto.y = monstruoObjeto.y + monstruoObjeto.velocidadY;
  lienzo.clearRect(0, 0, map.width, map.height);
  lienzo.drawImage(mapaCampo, 0, 0, map.width, map.height);
  monstruoObjeto.pintarMonstruo();

    enviarPosicion(monstruoObjeto.x, monstruoObjeto.y)

  monstruosEnemigos.forEach(function (pathfinder){
    pathfinder.pintarMonstruo()
    revisarColision(pathfinder)
 })
  if (monstruoObjeto.velocidadX !== 0 || monstruoObjeto.velocidadY !== 0) {
   
  }
}

function enviarPosicion(x, y) {
  fetch(`http://192.168.1.5:8080/pathfinder/${jugadorId}/posicion`, { 
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      x,  y
    })
  }) 
  .then(function (res) {
    if(res.ok){
      res.json()
        .then(function ({ enemigos }) {
           monstruosEnemigos = enemigos.map(function (enemigo) {
              let monsterEnemy 
              const monsterName = enemigo.monster.nombre || ""
              if (monsterName === "Hipoge") {
                monsterEnemy = new Pathfinder("Hipoge","./resources/img/1.png", 5,"./resources/img/11.png", enemigo.id);
              } else if (monsterName === "Capipepo"){
                monsterEnemy = new Pathfinder("Capipepo","./resources/img/2.png",5,"./resources/img/22.png", enemigo.id);
              } else if (monsterName === "Ratigueya") {
                monsterEnemy = new Pathfinder("Ratigueya","./resources/img/3.png",5,"./resources/img/33.png", enemigo.id);
              }
              
              monsterEnemy.x = enemigo.x
              monsterEnemy.y = enemigo.y
      
              return monsterEnemy
            })
        })
    }  
  })
}

function moverDerecha() {
  monstruoObjeto.velocidadX = 5;
}
function moverAbajo() {
  monstruoObjeto.velocidadY = 5;
}
function moverIzquierda() {
  monstruoObjeto.velocidadX = -5;
}
function moverArriba() {
  monstruoObjeto.velocidadY = -5;
}

function detenerMovimiento() {
  monstruoObjeto.velocidadX = 0;
  monstruoObjeto.velocidadY = 0;
}

function pullKey(event) {
  switch (event.key) {
    case "w":
      moverArriba();
      break;
    case "s":
      moverAbajo();
      break;
    case "a":
      moverIzquierda();
      break;
    case "d":
      moverDerecha();
      break;
    default:
      break;
  }
}

function obtenerMonstruo() {
  for (let i = 0; i < arrayMonster.length; i++) {
    if (monsterPlayer === arrayMonster[i].name) {
      return arrayMonster[i];
    }
  }
}

function iniciarMapa() {
  monstruoObjeto = obtenerMonstruo(arrayMonster);
  intervalo = setInterval(pintarMapa, 50);
  window.addEventListener("keydown", pullKey);
  window.addEventListener("keyup", detenerMovimiento);
}

function revisarColision(enemigo) {
  const arribaMonstruoE = enemigo.y;
  const abajoMonstruoE = enemigo.y + enemigo.alto;
  const derechaMonstruoE = enemigo.x + enemigo.ancho;
  const izquierdaMonstruoE = enemigo.x;

  const arribaMonstruoJ = monstruoObjeto.y;
  const abajoMonstruoJ = monstruoObjeto.y + monstruoObjeto.alto;
  const derechaMonstruoJ = monstruoObjeto.x + monstruoObjeto.ancho;
  const izquierdaMonstruoJ = monstruoObjeto.x;
  if (
    abajoMonstruoJ < arribaMonstruoE ||
    arribaMonstruoJ > abajoMonstruoE ||
    derechaMonstruoJ < izquierdaMonstruoE ||
    izquierdaMonstruoJ > derechaMonstruoE
  ) {
    return;
  }
  detenerMovimiento();
  clearInterval(intervalo)
  enemigoId = enemigo.id
  sectionAttack.style.display = "flex";
  lookMap.style.display = "none";
  seleccionarMonstruoN(enemigo);
}

window.addEventListener("load", iniciarJuego);

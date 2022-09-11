const express = require("express");
const cors = require("cors")

const app = express();

app.use(cors())
app.use(express.static("public"))
app.use(express.json())

const jugadores = []

class Jugador {
    constructor(id){
        this.id = id
    }
    //192.168.1.5
    asignarMonster(monster){
        this.monster = monster
    }

    actualizarPosicion(x, y){
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques){
        this.ataques = ataques
    }
}

class Monster {
    constructor(nombre){
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
const id = `${Math.random()}`

const jugador = new Jugador(id)

jugadores.push(jugador)

res.setHeader("Access-Control-Allow-Origin", "*")

  res.send(id);
});

app.post("/pathfinder/:jugadorId",(req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.pathfinder || ""
    const monster = new Monster(nombre)

    const indexJugador = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (indexJugador >= 0) {
        jugadores[indexJugador].asignarMonster(monster)
    }
    console.log(jugadores);
    console.log(jugadorId);
    res.end()
})

app.post("/pathfinder/:jugadorId/posicion", (req, res) =>{
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const indexJugador = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (indexJugador >= 0) {
        jugadores[indexJugador].actualizarPosicion(x,y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    res.send({
        enemigos
    })
})

app.post("/pathfinder/:jugadorId/ataques",(req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const indexJugador = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (indexJugador >= 0) {
        jugadores[indexJugador].asignarAtaques(ataques)
    }
    res.end()
})

app.get("/pathfinder/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })

})

app.listen(8080, () => {
  console.log("Servidor Funcionando");
});

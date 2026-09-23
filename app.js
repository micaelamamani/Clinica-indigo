const express= require("express");
const cors= require("cors"); //cors 
const path = require("path");
const app= express();
const puerto= 3000; 
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.redirect("/Cliente/index.html");
});
// ver clientes(bd), req es la solicitud del cliente, res es la respuesta que se enviará al cliente
const pacientesRoutes= require("./rutas/pacientes");
app.use("/pacientes", pacientesRoutes);
const loginRouter= require("./rutas/login");
app.use("/login", loginRouter);
const rutasTurnos= require("./rutas/turnos");
app.use("/turnos", rutasTurnos);
const rutasDoctores= require("./rutas/doctores");
app.use("/doctores", rutasDoctores);
const rutasConsultas= require("./rutas/consultas");
app.use("/consultas", rutasConsultas);
const medicamentosRouter = require("./rutas/medicamentos");
app.use("/medicamentos", medicamentosRouter);
// se inicia el servidor
app.listen(puerto,() =>{ //3000 es el puerto donde se ejecuta el servidor, listen es el método que inicia el servidor y recibe una función de callback que se ejecuta cuando el servidor esta listo para recibir solicitudes
    console.log(`Servidor en ejecución en el puerto ${puerto}`);
});
// Importa la librería mongoose para interactuar con MongoDB.
const mongoose = require("mongoose");
// Carga las variables de entorno desde un archivo .env.
require("dotenv").config();

// Exporta una función asíncrona que se ejecutará cuando el bot se inicie.
module.exports = async (client) => {
  // Imprimimos un mensaje en la consola cuando el bot se conecte correctamente.
  console.log(`Bot conectado como ${client.user.username}`);
};

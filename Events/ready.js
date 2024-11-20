// Importa la librería mongoose para interactuar con MongoDB.
const mongoose = require("mongoose");
// Carga las variables de entorno desde un archivo .env.
require("dotenv").config();

// Exporta una función asíncrona que se ejecutará cuando el bot se inicie.
module.exports = async (client) => {
  // Imprimimos un mensaje en la consola cuando el bot se conecte correctamente.
  console.log(`Bot conectado como ${client.user.username}`);

  // Conecta a la base de datos MongoDB utilizando la URI almacenada en las variables de entorno.
  await mongoose.connect(process.env.MONGOOSE);

  // Verifica si la conexión a la base de datos fue exitosa.
  if (mongoose.connect) {
    // Aunque esto no es correcto, ya que no existe un método connect en mongoose que retorne verdadero o falso.
    console.log(`El bot se conectó a la base de datos.`); // Mensaje de éxito.
  } else {
    console.log(`El bot no se pudo conectar a la base de datos.`); // Mensaje de error.
  }
};

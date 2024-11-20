// Importa las clases Client y Collection de discord.js, así como REST y Routes para interactuar con la API de Discord.
const { Client, Collection, REST, Routes } = require("discord.js");
// Importa el módulo fs para manejar operaciones con archivos y directorios.
const fs = require("fs");
// Importa el módulo path para manejar y resolver rutas de archivos.
const path = require("path");
// Carga las variables de entorno desde un archivo .env para la configuración.
require("dotenv").config();

// Crea una instancia del cliente de Discord con los intents necesarios para recibir eventos.
const client = new Client({ intents: 53608447 });

// Inicializa colecciones para almacenar comandos, menús y botones.
client.collections = {
  commands: new Collection(),
  menus: new Collection(),
  buttons: new Collection(),
};

// Función para cargar archivos en una colección específica.
const loadFiles = (directory, collection) => {
  // Lee todos los archivos en el directorio especificado.
  fs.readdirSync(directory)
    .filter((file) => file.endsWith(".js")) // Filtra solo los archivos .js.
    .forEach((file) => {
      try {
        // Intenta requerir el archivo y agregarlo a la colección.
        const item = require(path.join(__dirname, directory, file));
        // Verifica si el ítem tiene la estructura adecuada (nombre).
        if (item.data && item.data.name) {
          collection.set(item.data.name, item); // Añade el ítem a su colección correspondiente.
        } else {
          console.warn(
            `El archivo en ${file} no contiene la estructura adecuada.`
          );
        }
      } catch (error) {
        console.error(`Error al cargar desde ${file}:`, error); // Maneja errores al cargar archivos.
      }
    });
};

// Carga comandos, menús y botones utilizando la función anterior.
loadFiles("Commands", client.collections.commands);
loadFiles("Menus", client.collections.menus);
loadFiles("Buttons", client.collections.buttons);

// Configura REST para interactuar con la API de Discord.
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Función para registrar comandos en Discord.
const registerCommands = async () => {
  try {
    // Envía una solicitud PUT para registrar comandos en el servidor.
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: client.collections.commands.map((cmd) => cmd.data.toJSON()), // Obtiene los comandos para registrar.
      }
    );
    console.log(
      `Se registraron ${client.collections.commands.size} comandos en el servidor.` // Mensaje de éxito.
    );
  } catch (error) {
    console.error(`Error al registrar los comandos:`, error); // Maneja errores al registrar comandos.
  }
};

// Ejecuta el registro de comandos.
registerCommands();

// Lee y registra los eventos desde la carpeta "Events".
fs.readdirSync("Events")
  .filter((filename) => filename.endsWith(".js")) // Filtra solo los archivos .js.
  .forEach((filename) => {
    try {
      // Intenta requerir el listener del evento.
      const listener = require(path.join(__dirname, "Events", filename));
      const eventName = path.basename(filename, ".js"); // Extrae el nombre del evento del archivo.
      client.on(eventName, (...args) => listener(...args)); // Registra el listener en el cliente.
    } catch (error) {
      console.error(`Error al cargar el evento ${filename}:`, error); // Maneja errores al cargar eventos.
    }
  });

// Inicia sesión en Discord utilizando el token de las variables de entorno.
client.login(process.env.TOKEN);

// Importa las clases necesarias de la librería discord.js
const {
  SlashCommandBuilder, // Herramienta para construir comandos tipo slash
  EmbedBuilder, // Herramienta para crear embeds
  ChatInputCommandInteraction, // Tipo de interacción para comandos de entrada de chat
} = require("discord.js"); // Importa la librería discord.js

// Exporta el módulo que contiene el comando
module.exports = {
  // Define los datos del comando usando SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName("ping") // Establece el nombre del comando como "ping"
    .setDescription("😛 Muestra la latencia del bot."), // Establece la descripción del comando con un emoji

  /**
   * Maneja la ejecución del comando /ping.
   * @param {ChatInputCommandInteraction} interaction - La interacción del comando.
   * @param {Client} client - El cliente de Discord.
   */
  async execute(interaction, client) {
    // Función que se ejecuta al llamar al comando
    // Obtiene la latencia en milisegundos desde el WebSocket
    const latency = client.ws.ping; // Almacena la latencia actual del WebSocket del cliente

    // Crea un embed para mostrar la latencia
    const embed = new EmbedBuilder() // Crea una instancia de EmbedBuilder
      .setAuthor({
        // Configura el autor del embed
        name: client.user.username, // Nombre del bot como autor
        iconURL: client.user.displayAvatarURL(), // URL del avatar del bot
      })
      .setColor("Random") // Establece un color aleatorio para el embed
      .setTitle("🏓 ¡Pong!") // Establece el título del embed con un emoji
      .setDescription(`La latencia es de **${latency} ms**.`) // Establece la descripción del embed, mostrando la latencia
      .setTimestamp() // Añade la fecha y hora actual al embed
      .setFooter({
        // Configura el pie de página del embed
        text: "Comando ejecutado", // Texto del pie del embed
        iconURL: interaction.guild.iconURL(), // Icono del pie, usando la imagen del servidor actual
      });

    // Responde a la interacción con el embed creado
    await interaction.reply({ embeds: [embed] }); // Envía la respuesta utilizando el embed
  },
};

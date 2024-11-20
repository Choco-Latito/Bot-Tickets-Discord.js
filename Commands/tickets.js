// Importa las clases necesarias de la librería discord.js
const {
  SlashCommandBuilder, // Herramienta para construir comandos tipo slash
  EmbedBuilder, // Herramienta para crear embeds
  ChatInputCommandInteraction, // Tipo de interacción para comandos de entrada de chat
  ChannelType, // Permite definir tipos de canales
  ActionRowBuilder, // Herramienta para construir filas de acción (botones, menús, etc.)
  StringSelectMenuBuilder, // Herramienta para crear menús de selección de texto
  StringSelectMenuOptionBuilder, // Herramienta para crear opciones dentro de un menú de selección de texto
} = require("discord.js"); // Importa la librería discord.js

// Exporta el módulo que contiene el comando
module.exports = {
  // Define los datos del comando usando SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName("tickets") // Establece el nombre del comando como "tickets"
    .setDescription("🤑 Establece un sistema de tickets.") // Establece la descripción del comando con un emoji
    .addChannelOption(
      // Añade una opción para seleccionar un canal
      (
        option // Función que recibe el objeto de opción
      ) =>
        option
          .setName("canal") // Nombre de la opción para el canal
          .setDescription("Canal donde enviar el sistema.") // Descripción de la opción
          .setRequired(true) // Establece que esta opción es obligatoria
          // Define el tipo de canal permitido: solo canales de texto en el servidor
          .addChannelTypes(ChannelType.GuildText)
    ),

  /**
   * Maneja la ejecución del comando /tickets.
   * @param {ChatInputCommandInteraction} interaction - La interacción del comando.
   * @param {Client} client - El cliente de Discord.
   */
  async execute(interaction, client) {
    // Función que se ejecuta al llamar al comando
    // Extrae las opciones y el servidor de la interacción
    const { options, guild } = interaction; // Desestructura las opciones y el servidor de la interacción

    const channel = options.getChannel("canal"); // Obtiene el canal seleccionado por el usuario

    // Crea un nuevo embed para la respuesta
    const embed = new EmbedBuilder() // Crea una instancia de EmbedBuilder
      .setAuthor({
        // Configura el autor del embed
        name: client.user.username, // Nombre del bot como autor
        iconURL: client.user.displayAvatarURL(), // URL del avatar del bot
      })
      .setTitle("🛠️ Panel de Soporte") // Establece el título del embed con un emoji
      .setDescription(
        // Establece la descripción del embed
        `Abre un ticket de soporte haciendo clic en una de las opciones de menú aquí abajo. 💬` // Mensaje de instrucción con emojis
      )
      .setColor("Random") // Establece un color aleatorio para el embed
      .setTimestamp() // Añade la fecha y hora actual al embed
      .setImage(
        // Añade una imagen al embed
        `https://cdn.discordapp.com/attachments/1150529910201389116/1308817433007624312/xd.png?ex=673f52b8&is=673e0138&hm=74ef6616a206420c8e953aa3abe5ab1f6a0a4f0581551eaafa2729c70b663102&`
      )
      .addFields(
        // Añade campos adicionales al embed
        {
          name: "¿Cómo abrir un ticket? 🤔", // Título del primer campo con emoji
          // Proporciona instrucciones sobre cómo abrir un ticket, usando emojis para hacer el texto más atractivo
          value:
            "1. Selecciona una opción de menú. 📋\n2. Describe tu problema. ✍️\n3. Espera a que un moderador te atienda. ⏳",
        },
        {
          name: "Tiempo de respuesta ⏰", // Título del segundo campo con emoji
          // Información sobre el tiempo de respuesta esperado
          value: "Generalmente, respondemos en menos de 24 horas. 📅",
        }
      )
      .setFooter({
        // Configura el pie de página del embed
        text: "Comando ejecutado", // Texto del pie del embed
        iconURL: guild.iconURL(), // Icono del pie, usando la imagen del servidor actual
      });

    // Crea un menú de selección para las opciones de soporte
    const menu = new ActionRowBuilder().addComponents(
      // Crea una fila de acción y añade componentes
      new StringSelectMenuBuilder() // Crea un menú de selección
        .setCustomId("support") // Establece un ID personalizado para el menú
        .setDisabled(false) // Habilita el menú
        .setMaxValues(1) // Establece el número máximo de valores seleccionables
        .setMinValues(1) // Establece el número mínimo de valores seleccionables
        .addOptions(
          // Añade opciones al menú
          new StringSelectMenuOptionBuilder() // Crea la primera opción
            .setDefault(true) // Marca esta opción como predeterminada
            .setDescription(`Selecciona una de las opciones.`) // Descripción de la opción
            .setEmoji("😶‍🌫️") // Emoji asociado a la opción
            .setLabel("Selecciona una de las opciones") // Etiqueta que se mostrará en el menú
            .setValue("one"), // Valor que se enviará si se selecciona esta opción

          new StringSelectMenuOptionBuilder() // Crea la segunda opción
            .setDefault(false) // No es predeterminada
            .setDescription(`Abrir un ticket de soporte.`) // Descripción de la opción
            .setEmoji("☢️") // Emoji asociado a la opción
            .setLabel("Soporte") // Etiqueta que se mostrará en el menú
            .setValue("two"), // Valor que se enviará si se selecciona esta opción

          new StringSelectMenuOptionBuilder() // Crea la tercera opción
            .setDefault(false) // No es predeterminada
            .setDescription(`Abrir un ticket de Reportes.`) // Descripción de la opción
            .setEmoji("😶") // Emoji asociado a la opción
            .setLabel("Reportes") // Etiqueta que se mostrará en el menú
            .setValue("three"), // Valor que se enviará si se selecciona esta opción

          new StringSelectMenuOptionBuilder() // Crea la cuarta opción
            .setDefault(false) // No es predeterminada
            .setDescription(`Abrir un ticket de Donaciones.`) // Descripción de la opción
            .setEmoji("😶") // Emoji asociado a la opción
            .setLabel("Donaciones") // Etiqueta que se mostrará en el menú
            .setValue("four") // Valor que se enviará si se selecciona esta opción
        )
    );

    // Responde a la interacción enviando el embed y el menú de selección al canal seleccionado
    await channel.send({ embeds: [embed], components: [menu] }); // Envía la respuesta utilizando el embed y el menú

    // Responde al usuario que ejecutó el comando con un mensaje efímero
    await interaction.reply({
      content: `Sistema enviado correctamente`, // Mensaje de confirmación
      ephemeral: true, // Hace que el mensaje solo sea visible para el usuario que lo ejecutó
    });
  },
};

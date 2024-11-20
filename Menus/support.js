// Importando objetos necesarios de discord.js
const {
  StringSelectMenuInteraction, // Para manejar interacciones con menús de selección de cadenas
  Client, // Clase principal del cliente
  ActionRowBuilder, // Para construir filas de componentes de mensajes
  ButtonBuilder, // Para construir botones
  ButtonStyle, // Estilos de botones
  ChannelType, // Tipos de canales, como texto o voz
} = require("discord.js");

// Importando el modelo de conteo de tickets desde un archivo de esquema
const TicketCount = require("../Schemas/ticketSchema"); // Cambia la ruta según la ubicación del modelo

// Cargando las variables de entorno desde el archivo .env
require("dotenv").config();

module.exports = {
  data: {
    name: "support", // Nombre del comando
  },
  /**
   *
   * @param {StringSelectMenuInteraction} interaction - Interacción del menú de selección
   * @param {Client} client - Instancia del cliente de Discord
   */
  async execute(interaction, client) {
    // Deferring la respuesta para indicar que se está procesando, asegurando que el usuario no pierda la paciencia
    await interaction.deferReply({ ephemeral: true });

    // Obtener el valor seleccionado por el usuario
    const value = interaction.values[0];

    // Comprobar si el usuario ya tiene un ticket abierto buscando en los canales
    const canalxd = interaction.guild.channels.cache.find(
      (c) => c.topic === interaction.user.id // el canal que contiene el ID del usuario como tema
    );

    // Si el usuario ya tiene un ticket abierto, notificarlo
    if (canalxd) {
      await interaction.followUp({
        content: `Ya tienes un ticket abierto: **<#${canalxd.id}>**.\n`,
        ephemeral: true, // Solo el usuario verá este mensaje
        allowedMentions: { repliedUser: false }, // No mencionar al usuario al responder
      });
      return; // Salir de la función
    }

    // Obtener el rol de staff de la guild usando la variable de entorno
    const staff = interaction.guild.roles.cache.get(process.env.STAFF_ID);

    // Obtiene o crea el documento del conteo de tickets en la base de datos
    let ticketCount = await TicketCount.findOne({
      GuildId: interaction.guild.id, // Buscar por ID de la guild
    });

    // Si no existe, crea uno nuevo
    if (!ticketCount) {
      ticketCount = new TicketCount({
        GuildId: interaction.guild.id,
        TicketNumber: 0, // Inicializando el conteo de tickets en 0
      });
    }

    // Incrementa el número de tickets
    ticketCount.TicketNumber += 1; // Aumentar el contador de tickets en uno
    await ticketCount.save(); // Guarda el conteo actualizado en la base de datos

    // Crea el canal del ticket con el nuevo número asignado
    const canal = await interaction.guild.channels.create({
      name: `ticket-${ticketCount.TicketNumber}`, // Nombre del canal incluye el número de ticket
      type: ChannelType.GuildText, // Tipo de canal: texto
      parent: process.env.CATEGORY_ID, // Establecer la categoría del canal usando la variable de entorno
      topic: interaction.user.id, // Asigna el ID del usuario como tema del canal
    });

    // Mensaje de bienvenida que se enviará en el canal de ticket
    const contenido = `Bienvenid@ ${interaction.user}, pronto el staff ${staff} le atenderá pronto en sus consultas.`;

    // Creación de botones para el canal de ticket
    const button = new ActionRowBuilder().addComponents(
      // Botón para cerrar el ticket
      new ButtonBuilder()
        .setCustomId("close") // Identificador del botón
        .setDisabled(false) // El botón está habilitado
        .setEmoji(`💫`) // Emoji que aparece en el botón
        .setLabel("Cerrar") // Texto que aparece en el botón
        .setStyle(ButtonStyle.Danger) // Estilo del botón
    );

    // Usar un switch para diferentes acciones basadas en el valor seleccionado del menú
    switch (value) {
      case "one":
      case "two":
      case "three":
      case "four":
        try {
          // Establecer permisos para el canal
          await canal.permissionOverwrites.create(canal.guild.roles.everyone, {
            ViewChannel: false, // Todos no pueden ver el canal
            SendMessages: false, // Todos no pueden enviar mensajes en el canal
          });

          // Permitir al rol de staff ver y enviar mensajes
          await canal.permissionOverwrites.create(staff, {
            ViewChannel: true,
            SendMessages: true,
          });

          // Permitir al usuario que creó el ticket ver y enviar mensajes
          await canal.permissionOverwrites.create(interaction.user.id, {
            ViewChannel: true,
            SendMessages: true,
          });

          // Enviar el contenido en el canal de ticket
          await canal.send({
            content: contenido,
            components: [button], // Añadir los botones creados anteriormente
          });

          // Responder al usuario confirmando que se creó el ticket
          await interaction.followUp({
            content: `Ticket generado correctamente en ${canal}`,
            ephemeral: true, // Solo el usuario verá este mensaje
          });
        } catch (error) {
          console.error("Error al crear el ticket:", error); // Registrar el error en la consola
          await interaction.followUp({
            content:
              "Hubo un error al crear el ticket, por favor intenta nuevamente.", // Mensaje de error enviado al usuario
            ephemeral: true, // Solo el usuario verá este mensaje
          });
        }
        break; // Finalizar el caso actual

      default:
        break; // Si no coincide con ninguno de los casos anteriores, simplemente salir
    }
  },
};

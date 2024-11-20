// Importa las clases ButtonInteraction, Client y GuildChannel de la librería discord.js.
const { ButtonInteraction, Client, GuildChannel } = require("discord.js");

// Exporta un módulo que representa el comando del botón "close".
module.exports = {
  data: {
    name: "close", // Nombre del comando del botón.
  },
  /**
   * Maneja la interacción del botón "close".
   * @param {ButtonInteraction} interaction - La interacción del botón.
   * @param {Client} client - La instancia del cliente de Discord.
   */
  async execute(interaction, client) {
    // Verifica si la interacción se realizó en un canal de tipo GuildChannel (canal de texto en un servidor).
    if (interaction.channel instanceof GuildChannel) {
      // Obtener el ticket del usuario a partir del topic del canal.
      const ticketOwnerId = interaction.channel.topic; // Suponiendo que el topic contiene el ID del propietario.

      // Asegúrate de que el ID del propietario sea válido.
      if (!ticketOwnerId) {
        console.error(
          "ID del propietario no encontrado en el topic del canal."
        );
        // Responde al usuario que no se pudo encontrar el ID del propietario.
        return await interaction.reply({
          content: "No se pudo encontrar el ID del propietario del ticket.",
          ephemeral: true, // El mensaje es efímero, solo el usuario puede verlo.
        });
      }

      // Intenta buscar al miembro desde el servidor usando el ID del propietario.
      const ticketOwner = await interaction.guild.members
        .fetch(ticketOwnerId) // Busca al miembro en el servidor.
        .catch((error) => {
          console.error("Error al buscar al miembro:", error); // Registra el error si ocurre.
          return null; // Retorna null si hay un error.
        });

      // Mensaje que se enviará al propietario del ticket.
      const closeMessage =
        "Tu ticket ha sido cerrado. Si necesitas más asistencia, no dudes en abrir uno nuevo.";

      // Verifica si se encontró al propietario del ticket.
      if (ticketOwner) {
        // Enviar un mensaje directo al propietario del ticket.
        try {
          await ticketOwner.send(closeMessage); // Envía el mensaje directo.
          console.log(
            `Mensaje enviado a ${ticketOwner.user.tag}: ${closeMessage}` // Registra el envío exitoso del mensaje.
          );
        } catch (error) {
          // Captura errores al intentar enviar el mensaje directo.
          console.error(
            `No se pudo enviar un MD al usuario con ID ${ticketOwnerId}. Es posible que tenga los MD cerrados. Error: ${error.message}`
          );
        }
      } else {
        // Si no se encontró al miembro, registra el error.
        console.error(`No se encontró al miembro con ID ${ticketOwnerId}.`);
      }

      // Responder a la interacción informando que el canal se cerrará.
      await interaction.reply({
        content: "El canal del ticket se cerrará en 10 segundos.",
        ephemeral: true, // Este mensaje es efímero.
      });

      // Cerrar el canal después de 10 segundos.
      const channelName = interaction.channel.name; // Almacena el nombre del canal.

      // Establece un temporizador para cerrar el canal después de 10 segundos.
      setTimeout(async () => {
        try {
          await interaction.channel.delete(
            "El ticket fue cerrado por el usuario." // Mensaje que se muestra al cerrar el canal.
          );
          console.log(`Canal ${channelName} cerrado.`); // Registra el cierre del canal.
        } catch (error) {
          // Captura errores al intentar cerrar el canal.
          console.error("Error al intentar cerrar el canal:", error);
        }
      }, 10000); // 10000 ms = 10 segundos.
    } else {
      // Si la interacción no se realizó en un canal de texto, responde al usuario.
      await interaction.reply({
        content: "Este botón solo puede usarse en un canal de texto.", // Mensaje informando que el botón no es válido.
        ephemeral: true, // Este mensaje es efímero.
      });
    }
  },
};

// Importa la clase ChatInputCommandInteraction de la librería discord.js.
const { ChatInputCommandInteraction } = require("discord.js");

/**
 * Maneja las interacciones de los comandos de entrada de texto.
 * @param {ChatInputCommandInteraction} interaction - La interacción que recibió el bot.
 */

// Este manejador se ejecuta cada vez que el bot recibe una interacción de un usuario.
module.exports = async (interaction) => {
  // Verifica si la interacción es un comando de entrada de texto.
  if (interaction.isChatInputCommand()) {
    // Intenta obtener el comando correspondiente al nombre de la interacción del cliente.
    const command = interaction.client.collections.commands.get(
      interaction.commandName
    );

    // Verifica si se encontró el comando en la colección.
    if (!command) {
      // Si el comando no se encuentra, responde al usuario.
      return await interaction.reply({
        content: "Comando no encontrado.", // Mensaje de respuesta para el usuario.
        ephemeral: true, // El mensaje es efímero, solo el usuario puede verlo.
      });
    }

    // Intenta ejecutar el comando.
    try {
      // Ejecuta el método `execute` del comando con la interacción y el cliente.
      await command.execute(interaction, interaction.client);
    } catch (error) {
      // Captura errores que ocurren al ejecutar el comando.
      console.error(
        `Error al ejecutar el comando ${interaction.commandName}:`,
        error // Registra el error en la consola.
      );

      // Informa al usuario que ocurrió un error al ejecutar el comando.
      await interaction.reply({
        content: "Hubo un error al ejecutar este comando.", // Mensaje informando del error al usuario.
        ephemeral: true, // Este mensaje también es efímero.
      });
    }
  }
  // Verifica si la interacción es un menú de selección.
  else if (interaction.isStringSelectMenu()) {
    // Divide el customId del menú para obtener el identificador.
    const menuId = interaction.customId.split("_");
    // Obtiene el menú de la colección usando el primer elemento de menuId.
    const menu = interaction.client.collections.menus.get(menuId[0]);
    // Si el menú no se encuentra, simplemente retorna.
    if (!menu) return;

    // Ejecuta la acción relacionada con el menú.
    await menu.execute(interaction, interaction.client, menuId.slice(1));
  }
  // Verifica si la interacción es un botón.
  else if (interaction.isButton()) {
    // Divide el customId del botón para obtener el identificador.
    const buttonId = interaction.customId.split("_");
    // Obtiene el botón de la colección usando el primer elemento de buttonId.
    const button = interaction.client.collections.buttons.get(buttonId[0]);
    // Si el botón no se encuentra, simplemente retorna.
    if (!button) return;

    // Ejecuta la acción relacionada con el botón.
    await button.execute(interaction, interaction.client, buttonId.slice(1));
  }
  // Si la interacción no es un comando, un menú o un botón.
  else {
    return; // Simplemente retorna, no se maneja ningún caso.
  }
};

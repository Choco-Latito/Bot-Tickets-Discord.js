// Importa las clases Schema y model de la librería mongoose para definir esquemas y modelos de datos.
const { Schema, model } = require("mongoose");

// Define el esquema para los contadores de tickets.
const ticketCountSchema = new Schema({
  // Propiedad que almacena el ID del servidor (Guild).
  GuildId: { type: String, required: true }, // Asegúrate de que esté correctamente escrito (utiliza `required` para hacer este campo obligatorio).

  // Propiedad que almacena el número de tickets, que comienza en 0 por defecto.
  TicketNumber: { type: Number, default: 0 },
});

// Exporta el modelo 'TicketCount', que representa la colección en la base de datos.
module.exports = model("TicketCount", ticketCountSchema);

import { Socket } from "socket.io";
// Este es el fichero encargado de manejar las conexiones y los juegos
// que hay en marcha
export default async function handleConnection(socket: Socket) {
  console.log("User connected");

  // Unirse a un juego
  socket.on("jGame", (gameId: string) => {
    console.log("Joining game", gameId);
    socket.join(gameId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
}
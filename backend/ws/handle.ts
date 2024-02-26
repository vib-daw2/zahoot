import { Socket } from "socket.io";
import joinGame from "./events/joinGame";

// Este es el fichero encargado de manejar las conexiones y los juegos
// que hay en marcha
export default async function handleConnection(socket: Socket) {
    console.log("User connected");

    // Unirse a un juego
    socket.on("joinGame", (data: string) => {
        joinGame(data, socket);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
}
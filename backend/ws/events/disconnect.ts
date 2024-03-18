import { Socket } from "socket.io";
import running from "../ongoing/games";

export default async function handleDisconnect(ws: Socket) {
    // Comprobamos a que gameId pertenece el usuario
    let gameId = "";
    for (let room of ws.rooms) {
        if (room !== ws.id) {
            gameId = room;
            break;
        }
    }

    // Si el usuario pertenece a algun juego, lo quitamos
    if (gameId) {
        let wasPlayerHost = await running.leaveGame(gameId, ws.id); // Dejamos el juego

        // En caso que el jugador que se va sea el host, desconectamos a todos los de la sala
        if (wasPlayerHost) {
            ws.to(gameId).emit("forceDisconnect", JSON.stringify({ message: "Host has left the game" }));
        } else {
            // En caso que el jugador que se va no sea el host, avisamos a los demás jugadores que ha habido una desconexión
            ws.to(gameId).emit("playerDisconnect", JSON.stringify({ userId: ws.id }));
        }

        // Salimos de la sala
        ws.leave(gameId);
    }
}
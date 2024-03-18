import { Socket } from "socket.io";
import running from "../ongoing/games";

export default function handleDisconnect(ws: Socket) {
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
        ws.to(gameId).emit("playerDisconnect", JSON.stringify({ userId: ws.id }));
        let wasPlayerHost = running.leaveGame(gameId, ws.id);
        if (wasPlayerHost) {
            ws.to(gameId).emit("forceDisconnect", JSON.stringify({ message: "Host has left the game" }));
        }
        ws.leave(gameId);
    }
}
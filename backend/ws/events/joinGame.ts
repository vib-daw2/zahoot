import { Socket } from "socket.io";

import running from "../ongoing/games";
import getDb from "../../prisma/db";

export default async function joinGame(data: string, socket: Socket) {
    const dataJ: { gameId: string, name: string } = JSON.parse(data);

    // Comprobamos si el juego existe
    const db = await getDb();
    const exists = await db.ongoingGame.findFirst({
        where: {
            gamePin: dataJ.gameId,
        }
    }); 

    if (!exists) {
        socket.emit("forceDisconnect", JSON.stringify({ message: "Game does not exist" }));
        socket.disconnect();
        return;
    }

    let id = running.joinGame(dataJ.gameId, dataJ.name, socket.id); // Añade el jugador al juego

    await socket.join(dataJ.gameId as string); // Unir al jugador a la sala de WS
    console.log(`User ${id} joined game ${dataJ.gameId}`);

    // Devolvemos la información del juego al cliente
    socket.emit("joinedGame", JSON.stringify({
        currentUser: { id, name: dataJ.name },
        participants: running.getPlayers(dataJ.gameId),
    }));

    // Mandamos a todos los jugadores la lista de jugadores actualizada
    socket.to(dataJ.gameId satisfies string as string).emit("currentPlayers", JSON.stringify(running.getPlayers(dataJ.gameId).sort((a, b) => a.id - b.id)));
}

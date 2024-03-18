import { Socket } from "socket.io";

import running from "../ongoing/games";

export default async function joinGame(data: string, socket: Socket) {
    const dataJ: { gameId: string, name: string } = JSON.parse(data);

    let id = running.joinGame(dataJ.gameId, dataJ.name, socket.id); // Añade el jugador al juego

    // Si el id es -1, el juego no existe
    if (id === -1) {
        socket.emit("forceDisconnect", JSON.stringify({ message: "Game does not exist" }));
        socket.disconnect();
        return;
    }

    await socket.join(dataJ.gameId as string); // Unir al jugador a la sala de WS
    console.log(`User ${id} joined game ${dataJ.gameId}`);

    // Devolvemos la información del juego al cliente
    socket.emit("joinedGame", JSON.stringify({
        currentUser: { id, name: dataJ.name },
        participants: running.getPlayers(dataJ.gameId),
    }));

    // Mandamos a todos los jugadores la lista de jugadores actualizada
    socket.to(dataJ.gameId as string).emit("currentPlayers", JSON.stringify(running.getPlayers(dataJ.gameId).sort((a, b) => a.id - b.id)));
}

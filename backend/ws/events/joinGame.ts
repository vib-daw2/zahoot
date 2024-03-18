import { Socket } from "socket.io";

import running from "../ongoing/games";
import getDb from "../../prisma/db";

export default async function joinGame(data: string, socket: Socket) {
    const dataJ: { gameId: string, name: string } = JSON.parse(data);
    console.log(running.getPlayers(dataJ.gameId).map(x => x.name).includes(dataJ.name))

    // Si el game pin no existe, emitir un mensaje de error y desconectar al usuario
    let exists = await checkIfGamePinExistsInDatabase(dataJ.gameId);
    if (!exists) {
        console.log("Game does not exist")
        socket.emit("forceDisconnect", JSON.stringify({ message: "Game does not exist" }));
        socket.disconnect();
        return;
    } else {
        console.log("Game exists")
        await socket.join(dataJ.gameId as string);
        let id = running.joinGame(dataJ.gameId, dataJ.name, socket.id);
        socket.emit("joinedGame", JSON.stringify({
            currentUser: { id, name: dataJ.name },
            participants: running.getPlayers(dataJ.gameId),
        }));
        socket.to(dataJ.gameId as string).emit("currentPlayers", JSON.stringify(running.getPlayers(dataJ.gameId).sort((a, b) => a.id - b.id)));
        console.log(running.getPlayers(dataJ.gameId))
    }
}

async function checkIfGamePinExistsInDatabase(gamePin: string) {
    const db = await getDb();
    const game = await db.ongoingGame.findUnique({
        where: {
            gamePin,
        },
    });
    return game !== null;
}
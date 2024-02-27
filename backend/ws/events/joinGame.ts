import { Socket } from "socket.io";

import running from "../ongoing/games";

export default async function joinGame(data: string, socket: Socket) {
    const dataJ: { gameId: string, name: string } = JSON.parse(data);
    console.log(running.getPlayers(dataJ.gameId).map(x => x.name).includes(dataJ.name))
    // if (dataJ.name === "" || running.getPlayers(dataJ.gameId).map(x => x.name).includes(dataJ.name)){
    //     socket.emit("error", "Invalid name or name already in use");
    //     console.warn("Invalid name or name already in use");
    //     return;
    // }
    await socket.join(dataJ.gameId as string);
    console.log(`User ${dataJ.name} joined game ${dataJ.gameId}`);
    let id = running.joinGame(dataJ.gameId, dataJ.name);
    console.log({ id})
    socket.emit("joinedGame", JSON.stringify({
        currentUser: { id, name: dataJ.name},
        participants: running.getPlayers(dataJ.gameId),
    }
    ));
    console.log({
        currentUser: { id, name: dataJ.name},
        participants: running.getPlayers(dataJ.gameId).map(x => ({ id: x.id, name: x.name }) ),
    })
    socket.to(dataJ.gameId as string).emit("currentPlayers", JSON.stringify(running.getPlayers(dataJ.gameId).sort((a, b) => a.id - b.id)));
    console.log(running.getPlayers(dataJ.gameId))
}
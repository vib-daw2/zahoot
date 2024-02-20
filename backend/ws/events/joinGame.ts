import { Socket } from "socket.io";

import running from "../ongoing/games";

export default async function joinGame(data: string, socket: Socket) {
    const dataJ: { gameId: string, name: string } = JSON.parse(data);
    await socket.join(dataJ.gameId as string);
    let id = running.joinGame(dataJ.gameId, dataJ.name);
    socket.emit("joinedGame", JSON.stringify({ id, name: dataJ.name }));
    socket.to(dataJ.gameId as string).emit("currentPlayers", JSON.stringify(running.getPlayers(dataJ.gameId)));
}
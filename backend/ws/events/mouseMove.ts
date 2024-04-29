import { Socket } from "socket.io";
import running from "../ongoing/games";
import io from "../../server";

export default async function moveMouse(data: string, socket: Socket) {
    const { gameId, id, x, y}: { gameId: string, id: number, x: number, y: number } = JSON.parse(data);
    const players = running.getPlayers(gameId)
    const player = players.find(p => p.id == id);
    if (!player) {
        console.error("Player not found");
        console.log(data)
        return;
    }
    player.x = x;
    player.y = y;
    io.to(gameId).emit("currentPlayers", JSON.stringify(players.sort((a, b) => a.id - b.id)));
}
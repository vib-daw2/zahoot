import { Socket } from "socket.io";
import running from "../ongoing/games";
import io from "../../server";

export default async function roundEnd(data: string, socket: Socket) {
    const { gameId }: { gameId: string } = JSON.parse(data);
    const leaderboard = running.getLeaderboard(gameId)
    io.to(gameId).emit("roundEnd", JSON.stringify(leaderboard))
}
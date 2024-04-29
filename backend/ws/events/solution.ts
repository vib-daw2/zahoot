import { Socket } from "socket.io";
import running from "../ongoing/games";
import io from "../../server";
import roundEnd from "./roundEnd";


export default async function solution(data: string, socket: Socket) {
    const response = JSON.parse(data) as { gameId: string, questionId: number, solution: number, userId: number }
    running.addResponse(response.gameId,response.userId, response.solution)
    const players = running.getPlayers(response.gameId)
    
    // Envía la solución correcta a los jugadores que ya han respondido
    const game = running.getGame(response.gameId)
    if (!game) return
    game.updateScores()
    const currentQuestion = game.currentQuestion
    const nonResponded = players.filter(x => x.responses.length < currentQuestion + 1 && !x.isHost)
    const correctSolution = game.questions[currentQuestion].choices.find(x => x.isCorrect)
    if (!correctSolution) return
    const correctSolutionIndex = game.questions[currentQuestion].choices.indexOf(correctSolution)
    if (nonResponded.length === 0){
        console.log("All players responded")
        io.to(response.gameId).except(game.players.find(x => x.id !== 1)?.socketId ?? "").emit("allResponded", JSON.stringify(correctSolutionIndex))
        io.to(response.gameId).emit("correctSolution", JSON.stringify({solution: correctSolutionIndex, allResponded: true}))
        setTimeout(() => {
            roundEnd(data, socket)
        }, 5000);
    } else {
        io.to(response.gameId).except(nonResponded.map(x => x.socketId)).emit("correctSolution", JSON.stringify({solution: correctSolutionIndex, allResponded: false}))
    }
}
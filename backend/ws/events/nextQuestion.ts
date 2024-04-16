import { Socket } from "socket.io";
import running from "../ongoing/games";
import io from "../../server";

export default async function nextQuestion(data: string, socket: Socket) {
    const { gameId }: { gameId: string } = JSON.parse(data);

    const roundCompleted = running.roundCompleted(gameId) // Comprueba si todos los jugadores han respondido

    const game = running.getGame(gameId) 
    if (!game) return

    const hasMoreQuestions = (running.getGame(gameId)?.currentQuestion ?? 1) < (running.getGame(gameId)?.questions.length ?? 0)
    if (roundCompleted && hasMoreQuestions) {
        const nextQuestion = running.nextQuestion(gameId)
        if (!nextQuestion){
            io.to(gameId).emit("gameEnd")
            return
        }
        console.log({ nextQuestion })
        io.to(gameId).emit("nextQuestion", JSON.stringify(nextQuestion))
    } else if (!roundCompleted && hasMoreQuestions) {
        const unanswered = running.getPlayers(gameId).filter(x => x.responses.length < game.currentQuestion)
        unanswered.forEach(x => {
            game.players.find(y =>
                y.socketId === x.socketId
            )?.responses.push(false)
        })
        const nextQuestion = running.nextQuestion(gameId)
        if (!nextQuestion){
            io.to(gameId).emit("gameEnd")
            return
        }
        io.to(gameId).emit("nextQuestion", JSON.stringify(running.nextQuestion(gameId)))
    } else if (!hasMoreQuestions) {
        io.to(gameId).emit("gameEnd")
    }
}
import { Socket } from "socket.io";
import joinGame from "./events/joinGame";
import moveMouse from "./events/mouseMove";
import { disconnect } from "process";
import handleDisconnect from "./events/disconnect";
import io from "../server";
import { AddResponse } from "./events/question-response";
import running from "./ongoing/games";

// Este es el fichero encargado de manejar las conexiones y los juegos
// que hay en marcha
export default async function handleConnection(socket: Socket) {
    console.log("User connected");

    // Unirse a un juego
    socket.on("joinGame", async (data: string) => {
        await joinGame(data, socket);
    });

    // Iniciar la partida
    socket.on("gameStart", (data: string) => {
        const { gameId }: { gameId: string } = JSON.parse(data);
        console.log(`game ${gameId} started`);
        io.to(gameId).emit("gameStart", JSON.stringify({ gameId }));
        //socket.send("gameStart", JSON.stringify({ gameId }));
    })

    // Mover el ratón
    socket.on("moveMouse", (data: string) => {
        moveMouse(data, socket);
    })

    // Enviar solución
    socket.on("solution", async (data: string) => {
        const response = JSON.parse(data) as { gameId: string, questionId: number, solution: number, userId: number }
        running.addResponse(response.gameId,response.userId, response.solution)
        const players = running.getPlayers(response.gameId)
        
        // Envía la solución correcta a los jugadores que ya han respondido
        const game = running.getGame(response.gameId)
        if (!game) return
        const currentQuestion = game.currentQuestion
        const nonResponded = players.filter(x => x.responses.length < currentQuestion + 1)
        const correctSolution = game.questions[currentQuestion].choices.find(x => x.isCorrect)
        if (!correctSolution) return
        const correctSolutionIndex = game.questions[currentQuestion].choices.indexOf(correctSolution)
        io.to(response.gameId).except(nonResponded.map(x => x.socketId)).emit("correctSolution", JSON.stringify(correctSolutionIndex))

        
    })

    socket.on("nextQuestion", (data: string) => {
        const { gameId }: { gameId: string } = JSON.parse(data);

        // Comprueba si todos los jugadores han respondido
        const roundCompleted = running.roundCompleted(gameId)
        console.log({roundCompleted})
        const game = running.getGame(gameId)
        if (!game) return
        console.log({ questions: game.questions.length, currentQuestion: game.currentQuestion })
        const hasMoreQuestions = (running.getGame(gameId)?.currentQuestion ?? 1) < (running.getGame(gameId)?.questions.length ?? 0)
        if (roundCompleted && hasMoreQuestions){
            const nextQuestion = running.nextQuestion(gameId)
            console.log({nextQuestion})
            io.to(gameId).emit("nextQuestion", JSON.stringify(running.nextQuestion(gameId)))
        } else if (!roundCompleted && hasMoreQuestions){
            const unanswered = running.getPlayers(gameId).filter(x => x.responses.length < game.currentQuestion)
            unanswered.forEach(x => {
                game.players.find(y =>
                    y.socketId === x.socketId
                )?.responses.push(false)
            })
            console.log({unanswered})
            io.to(gameId).emit("nextQuestion", JSON.stringify(running.nextQuestion(gameId)))   
        } else if (!hasMoreQuestions){
            io.to(gameId).emit("gameEnd")
        }
    })

    // Desconexión
    socket.on("disconnect", () => {
        handleDisconnect(socket);
    });
}
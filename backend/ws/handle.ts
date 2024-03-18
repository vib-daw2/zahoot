import { Socket } from "socket.io";
import joinGame from "./events/joinGame";
import moveMouse from "./events/mouseMove";

// Este es el fichero encargado de manejar las conexiones y los juegos
// que hay en marcha
export default async function handleConnection(socket: Socket) {
    console.log("User connected");

    // Unirse a un juego
    socket.on("joinGame", (data: string) => {
        joinGame(data, socket);
    });

    // Iniciar la partida
    socket.on("gameStart", (data: string) => {
        const { gameId }: { gameId: string } = JSON.parse(data);
        console.log(`game ${gameId} started`);
        socket.to(gameId).emit("gameStart", JSON.stringify({ gameId }));
    })

    // Mover el ratón
    socket.on("moveMouse", (data: string) => {
        moveMouse(data, socket);
    })

    // Enviar solución
    socket.on("solution", (data: string) => {
        const response = JSON.parse(data) as { gameId: string, questionId: number, solution: number, userId: number }
        console.log(response)
        socket.to(response.gameId).emit("nextQuestion")
    })

    // Desconexión
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
}
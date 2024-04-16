import { Socket } from "socket.io";
import joinGame from "./events/joinGame";
import moveMouse from "./events/mouseMove";
import { disconnect } from "process";
import handleDisconnect from "./events/disconnect";
import io from "../server";
import { AddResponse } from "./events/question-response";
import running from "./ongoing/games";
import solution from "./events/solution";
import nextQuestion from "./events/nextQuestion";

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
        solution(data, socket);        
    })

    socket.on("nextQuestion", (data: string) => {
        nextQuestion(data, socket);
    })

    // Desconexión
    socket.on("disconnect", () => {
        handleDisconnect(socket);
    });
}
import getDb from "../../prisma/db";

type Player = {
    id: number;
    name: string;
    socketId: string;
    x?: number;
    y?: number;
    isHost?: boolean;
}


class Game {
    public id: string;
    public players: Player[];

    constructor(id: string) {
        this.id = id;
        this.players = [];
    }

    // Añade un jugador a la partida
    public addPlayerToGame(playerName: string, socketId: string, isHost?: boolean): number {
        if (this.players.map(x => x.name).includes(playerName)) {
            this.players = this.players.filter(x => x.name !== playerName)
        }
        let id = this.players.length + 1;
        this.players.push({
            id: id,
            socketId,
            name: playerName,
            isHost: isHost,
        });
        return id;
    }
}

class GamePool {

    // Partidas en curso
    private games: Game[];

    constructor() {
        this.games = [];
    }

    // Añade un jugador a un juego. Crea el juego en caso de que no exista
    // Devuele el ID del jugador
    public joinGame(gameId: string, name: string, socketId: string): number {
        let game = this.games.find(g => g.id === gameId);
        if (!game) { // En caso que no se haya creado el juego
            // Comprobar si el game pin existe en la base de datos
            let existsGameInDB = this.checkIfGamePinExistsInDatabase(gameId);
            if (!existsGameInDB) {
                return -1; // El game pin no existe
            }
            game = new Game(gameId);
            this.games.push(game);
        }
        let isHost = game.players.length === 0;
        let id = game.addPlayerToGame(name, socketId, isHost);
        return id;
    }

    // Devuelve los jugadores de un juego
    public getPlayers(gameId: string): Player[] {
        let game = this.games.find(g => g.id === gameId);
        return game ? game.players : [];
    }

    // Deja un juego
    public async leaveGame(gameId: string, socketId: string) {
        let game = this.games.find(g => g.id === gameId);
        if (game) {
            let player = game.players.find(p => p.socketId === socketId);
            if (player?.isHost) {
                // Si el jugador que se va es el host, se elimina el juego
                this.games = this.games.filter(g => g.id !== gameId);
                await this.deleteGameOnDatabase(gameId);
                return true;
            } else {
                game.players = game.players.filter(p => p.socketId !== socketId);
                return false;
            }
        }
    }

    // Comprueba si el game pin existe en la base de datos
    private async checkIfGamePinExistsInDatabase(gamePin: string) {
        const db = await getDb();
        const game = await db.ongoingGame.findUnique({
            where: {
                gamePin,
            },
        });
        return game !== null;
    }

    // Elimina un juego de la base de datos
    private async deleteGameOnDatabase(gamePin: string) {
        const db = await getDb();
        await db.ongoingGame.delete({
            where: {
                gamePin,
            },
        });
    }
}

let running = new GamePool();

export default running;
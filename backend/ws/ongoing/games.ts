import getDb from "../../prisma/db";

type Player = {
    id: number;
    name: string;
    socketId: string;
    x?: number;
    y?: number;
}


class Game {
    public id: string;
    public players: Player[];

    constructor(id: string) {
        this.id = id;
        this.players = [];
    }

    // Añade un jugador a la partida
    public addPlayerToGame(playerName: string, socketId: string): number {
        if (this.players.map(x => x.name).includes(playerName)) {
            this.players = this.players.filter(x => x.name !== playerName)
        }
        let id = this.players.length + 1;
        this.players.push({
            id: id,
            socketId,
            name: playerName
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
        let id = game.addPlayerToGame(name, socketId);
        return id;
    }

    // Devuelve los jugadores de un juego
    public getPlayers(gameId: string): Player[] {
        let game = this.games.find(g => g.id === gameId);
        return game ? game.players : [];
    }

    // Elimina un jugador de un juego
    public leaveGame(gameId: string, socketId: string) {
        const game = this.games.find(x => x.id === gameId)
        if (!game) return
        game.players = game.players.filter(x => x.socketId !== socketId)
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
}

let running = new GamePool();

export default running;
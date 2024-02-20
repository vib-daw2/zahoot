type Player = {
    id: number;
    name: string;
}


class Game {
    public id: string;
    public players: Player[];

    constructor(id: string) {
        this.id = id;
        this.players = [];
    }

    public joinGame(name: string): number {
        this.players.push({
            id: this.players.length + 1,
            name
        });
        return this.players.length;
    }
}

class Games {

    private games: Game[];

    constructor() {
        this.games = [];
    }

    public joinGame(gameId: string, name: string): number {
        let game = this.games.find(g => g.id === gameId);
        if (!game) {
            game = new Game(gameId);
            this.games.push(game);
        }
        return game.joinGame(name);
    }

    public getPlayers(gameId: string): Player[] {
        let game = this.games.find(g => g.id === gameId);
        if (game) {
            return game.players;
        } else {
            return [];
        }
    }
}

let running = new Games();

export default running;
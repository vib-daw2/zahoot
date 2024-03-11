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

    public joinGame(name: string, socketId: string): number {
        if (this.players.map(x => x.name).includes(name)){
            this.players = this.players.filter(x => x.name !== name)
        }
        this.players.push({
            id: this.players.length + 1,
            socketId,
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

    public joinGame(gameId: string, name: string, socketId: string): number {
        let game = this.games.find(g => g.id === gameId);
        if (!game) {
            game = new Game(gameId);
            this.games.push(game);
        }
        return game.joinGame(name, socketId);
    }

    public getPlayers(gameId: string): Player[] {
        let game = this.games.find(g => g.id === gameId);
        return game ? game.players : [];
    }

    public leaveGame(gameId: string, socketId: string){
        const game = this.games.find(x => x.id === gameId)
        if (!game) return
        game.players = game.players.filter(x => x.socketId !== socketId)
    }
}

let running = new Games();

export default running;
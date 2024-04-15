import getDb from "../../prisma/db";

type Player = {
    id: number;
    name: string;
    socketId: string;
    x?: number;
    y?: number;
    isHost?: boolean;
    points: number;
    responses: boolean[];
}

type Question = {
    id: number;
    question: string;
    choices: QuestionChoice[];
}

type QuestionChoice = {
    id: number;
    choice: string;
    isCorrect: boolean;
}


class Game {
    public id: string;
    public players: Player[];
    public questions: Question[];
    public currentQuestion: number;

    constructor(id: string) {
        this.id = id;
        this.players = [];
        this.questions = []
        this.currentQuestion = 0;
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
            points: 0,
            responses: [],
        });
        return id;
    }

    public addResponse(playerId: number, response: number){
        const player = this.players.find(x => x.id === playerId)
        if (!player) return
        const currentQuestion = this.questions[this.currentQuestion]
        if (!currentQuestion) return
        const correctAnswer = currentQuestion.choices[response]?.isCorrect
        if (correctAnswer) {
            player.points += 1
            player.responses.push(true)
        } else {
            player.responses.push(false)
        }
    }
}

class GamePool {
    // Partidas en curso
    private games: Game[];

    constructor() {
        this.games = [];
    }

    public async addResponse(gameId: string, playerId: number, response: number) {
        const game = this.games.find(x => x.id === gameId)
        if (!game) return
        game.addResponse(playerId, response)
        console.log(game.players)
    }

    public getGame(gameId: string){
        return this.games.find(x => x.id === gameId)
    }

    public nextQuestion(gameId: string) {
        const game = this.games.find(x => x.id === gameId)
        if (!game) return
        game.currentQuestion += 1
        return game.questions[game.currentQuestion]
    }

    public roundCompleted(gameId: string) {
        const game = this.games.find(x => x.id === gameId)
        if (!game) return false
        const completed = game.players.filter(x => !x.isHost).every(x => x.responses.length === game.currentQuestion + 1)
        return completed
    }   

    // Añade un jugador a un juego. Crea el juego en caso de que no exista
    // Devuele el ID del jugador
    public async joinGame(gameId: string, name: string, socketId: string): Promise<number> {
        let game = this.games.find(g => g.id === gameId);

        // En caso que no se haya creado el juego, se crea
        if (!game) {
            game = new Game(gameId);
            const questions = await (getDb()).ongoingGame.findMany({
                select: {
                    QuestionSet: {
                        select: {
                            Questions: {
                                select: {
                                    id: true,
                                    question: true,
                                    choices: {
                                        select: {
                                            id: true,
                                            choice: true,
                                            isCorrect: true
                                        }
                                    },
                                }
                                
                            },
                            id: true,
                        }
                    },
                },
                where: {
                    gamePin: gameId
                },
            })
            game.questions = questions.flatMap(x => x.QuestionSet.Questions).map(x => ({
                id: x.id,
                question: x.question,
                choices: x.choices.map(y => ({
                    id: y.id,
                    choice: y.choice,
                    isCorrect: y.isCorrect
            }))}))
            
            this.games.push(game);
        }

        // En caso de que el jugador ya esté en la partida, se elimina
        let id = game.addPlayerToGame(name, socketId, game.players.length === 0);
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
        const db = getDb();
        const game = await db.ongoingGame.findUnique({
            where: {
                gamePin,
            },
        });
        return game !== null;
    }

    // Elimina un juego de la base de datos
    private async deleteGameOnDatabase(gamePin: string) {
        const db = getDb();
        await db.ongoingGame.delete({
            where: {
                gamePin,
            },
        });
    }
}

let running = new GamePool();

export default running;
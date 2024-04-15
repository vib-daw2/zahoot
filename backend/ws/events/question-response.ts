import running from "../ongoing/games";

export async function AddResponse(player: number, gameId: string, response: number){
    running.addResponse(gameId, player, response)
}

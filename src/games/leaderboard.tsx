import { socket } from '@/lib/socket';
import { Participant } from '@/utils/schemas/participants';
import { Reorder, motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

interface Player {
    name: string;
    points: number;
    responses: boolean[];
}

function PlayerRank({ player, maxScore, score, setScore, rank }: { player: Player, maxScore: number, score: number, setScore: (score: number) => void, rank: number }) {
    const duration = player.points * 800 / maxScore;

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (player.points === 0) {
                return;
            }
            if (score < player.points && player.points > 0) {
                setScore(
                    Math.min(player.points, score + 100)
                )
            }
        }, 10);
        return () => clearInterval(interval);
    })

    const endAnimation = () => {
        setScore(player.points);
    }

    return (
        <div key={player.name} style={{ width: player.points * 800 / maxScore }} className={`relative w-full h-12 w-[${player.points * 400 / maxScore}]`}>

            <motion.div draggable={false} onAnimationEnd={() => endAnimation} key={player.name} initial={{ width: 0 }} animate={{ left: 0, width: [0, player.points * 800 / maxScore] }} transition={{ duration: duration / 1000 }}
                className='bg-cyan-400/50 flex justify-between items-center rounded-r-md h-12 px-4 absolute inset-0'>
                <div>{player.name} {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "💩"}</div>
                <div>{score}</div>
            </motion.div>
        </div>
    )
}

const Leaderboard = ({ initialPlayers, isAdmin, ended = false }: { initialPlayers: Participant[], isAdmin: boolean, ended?: boolean }) => {
    const [players, setPlayers] = React.useState<Player[]>(initialPlayers as Player[]);
    const [scores, setScores] = React.useState<number[]>([]);
    const { id } = useParams<{ id: string }>();

    React.useEffect(() => {
        setPlayers(initialPlayers as Player[]);
        setScores(Array(players.length).fill(0));
    }, []);

    const updateScoreAndOrder = (index: number, newScore: number) => {
        setScores(prevScores => {
            const newScores = [...prevScores];
            newScores[index] = newScore;
            return newScores;
        });

        setPlayers(prevPlayers => {
            const updatedPlayers = [...prevPlayers];
            const currentPlayer = updatedPlayers.splice(index, 1)[0];
            updatedPlayers.splice(findInsertIndex(updatedPlayers, newScore), 0, currentPlayer);
            return updatedPlayers;
        });
    };

    const findInsertIndex = (players: Player[], newScore: number): number => {
        let index = 0;
        while (index < players.length && players[index].points > newScore) {
            index++;
        }
        return index;
    };

    return (
        <div className='p-4 w-full h-screen flex justify-center items-center text-white flex-col'>
            <h1 className='text-4xl font-zahoot uppercase'>Leaderboard</h1>
            {ended && <h2 className='text-2xl font-zahoot uppercase'>Game Over - <span className=' font-bold text-cyan-400'>{initialPlayers.sort((a, b) => a.id - b.id).filter(x => x.points === Math.max(...players.map(p => (p.points ?? 0)))).map(x => x.name).join(", ")}</span> Won!</h2>}
            <div className='flex flex-col justify-start items-start mt-2 max-h-[60vh] overflow-y-auto overflow-x-hidden pr-4'>
                {players.reduce((acc, x) => x.points + acc, 0) === 0
                    ? <div className='text-xl text-slate-300'>No players have scored yet 💩</div>
                    : <Reorder.Group values={players.map(x => x.name)} onReorder={() => { }}>
                        {players.map((player, index) => (
                            <Reorder.Item key={player.name} value={player.name} className=' py-0.5'>
                                <PlayerRank
                                    player={player}
                                    rank={index + 1}
                                    maxScore={Math.max(...players.map(p => p.points))}
                                    score={scores[index]}
                                    setScore={score => updateScoreAndOrder(index, score)}
                                />
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                }
            </div>
            {isAdmin && !ended && <button onClick={() => socket.emit("nextQuestion", JSON.stringify({ gameId: id }))} className="w-full h-9 mt-4 max-w-lg mx-auto bg-cyan-400 text-cyan-900 hover:bg-cyan-300 rounded-md flex justify-center items-center gap-3">
                <div>
                    Next Question
                </div>
                <ArrowRightIcon size={24} />
            </button>}
        </div>
    );
};

export default Leaderboard;
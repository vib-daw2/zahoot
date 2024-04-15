import { socket } from '@/lib/socket'
import { AnimatePresence, LayoutGroup, Reorder, motion } from 'framer-motion';
import React, { useRef } from 'react'
import { useParams } from 'react-router-dom';

type Props = {}

interface Player {
    name: string;
    points: number;
    responses: boolean[];
}

function generateRandomResponses(length: number): boolean[] {
    const responses: boolean[] = [];
    for (let i = 0; i < length; i++) {
        responses.push(Math.random() < 0.5); // 50% chance of true/false
    }
    return responses;
}

function generatePlayers(numPlayers: number, numResponses: number): Player[] {
    const players: Player[] = [];
    for (let i = 1; i <= numPlayers; i++) {
        const playerName = `Player ${i}`;
        const responses = generateRandomResponses(numResponses);
        const points = responses.filter(response => response).length * 100;
        const player: Player = {
            name: playerName,
            points: points,
            responses: responses
        };
        players.push(player);
    }
    return players;
}

function PlayerRank({ player, maxScore, score, setScore }: { player: Player, maxScore: number, score: number, setScore: (score: number) => void }) {
    const duration = player.points * 800 / maxScore;
    const motionRef = useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (score < player.points) {
                setScore(
                    score + 50
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
                <div>{player.name}</div>
                <div>{score}</div>
            </motion.div>
        </div>
    )
}

const Leaderboard: React.FC = () => {
    const [players, setPlayers] = React.useState<Player[]>([]);
    const [scores, setScores] = React.useState<number[]>([]);

    React.useEffect(() => {
        const players = generatePlayers(12, 25);
        setPlayers(players);
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
            <div className='flex flex-col justify-start items-start mt-2 max-h-[60vh] overflow-y-auto overflow-x-hidden pr-4'>
                <Reorder.Group values={players.map(x => x.name)} onReorder={() => { }}>
                    {players.map((player, index) => (
                        <Reorder.Item key={player.name} value={player.name} className=' py-0.5'>
                            <PlayerRank
                                player={player}
                                maxScore={Math.max(...players.map(p => p.points))}
                                score={scores[index]}
                                setScore={score => updateScoreAndOrder(index, score)}
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
        </div>
    );
};

export default Leaderboard;
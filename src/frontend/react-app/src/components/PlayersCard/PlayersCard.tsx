import PlayerUniqueCard from "./PlayerUniqueCard";

interface Player {
    playerPhotoURL: string;
    playerName: string;
    playerId: string;
    singleValue: string;
    actualState: string;
    color: string;
    values: string[];
    metric: string;
}

interface PlayersCardProps {
    players: Player[];
    handlePlayerManagement: (playerId: string) => void;
}

export default function PlayersCard({ players, handlePlayerManagement }: PlayersCardProps) {
    return (
        <div className="flex flex-wrap justify-center gap-16">
            {players.map((player) => (
                <PlayerUniqueCard
                    key={player.playerId}
                    playerPhotoURL={player.playerPhotoURL}
                    playerName={player.playerName}
                    playerId={player.playerId}
                    singleValue={player.singleValue}
                    actualState={player.actualState}
                    color={player.color}
                    values={player.values}
                    metric={player.metric}
                    handlePlayerManagement={handlePlayerManagement}
                />
            ))}
        </div>
    );
}
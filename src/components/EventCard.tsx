// components/EventCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventCardProps {
  venue: string;
  day: string;
  time: string;
  players: number;
  maxPlayers: number;
  cost: number;
}

export default function EventCard({
  venue,
  day,
  time,
  players,
  maxPlayers,
  cost,
}: EventCardProps) {
  return (
    <Card className="w-[300px] rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{venue}</CardTitle>
        <p className="text-sm text-gray-500">{day} • {time}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm">
          <span className="font-semibold">{players}</span> / {maxPlayers} players
        </p>
        <p className="text-sm text-gray-700">₹ {cost} per person</p>
      </CardContent>
    </Card>
  );
}

"use client";

import PlayerComponent from "@/reusable/components/home/PlayerComponent";
import { useAuth } from "@/reusable/context/AuthContext";
import useHomePage from "@/reusable/hooks/useHomePage";
import { multiFetch } from "@/reusable/lib/utils";
import { Player } from "@/reusable/models/Player";
import { useEffect, useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [runSearch, setRunSearch] = useState(false);
  const [countDown, setCountDown] = useState<NodeJS.Timeout | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const { addFriend } = useHomePage();
  const { session } = useAuth();

  const getPlayer = () => {
    if (runSearch && search) {
      multiFetch<Player[]>("express", `/player/get-player/${search}`).then((f) => {
        const filteredFriends = f.filter((friend) => friend.username !== session?.user.username);

        setPlayers(filteredFriends);
      });
    }
    setRunSearch(false);
  };

  useEffect(() => {
    if (!search) setPlayers([]);
    if (countDown) clearTimeout(countDown);

    setCountDown(setTimeout(() => setRunSearch(true), 1000));
  }, [search]);

  useEffect(getPlayer, [runSearch]);

  return (
    <div className="mt-10 w-full flex-1">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        type="text"
        placeholder="Nombre de Usuario"
      />
      <div className="friend-list mt-10">
        {players.map((friend, i) => (
          <PlayerComponent key={i} player={friend} acceptFunc={() => addFriend(friend.username)} />
        ))}
      </div>
    </div>
  );
}

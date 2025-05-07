"use client";

import PlayerComponent from "@/reusable/components/home/PlayerComponent";
import { useAuth } from "@/reusable/context/AuthContext";
import useWs from "@/reusable/hooks/useWs";
import { multiFetch } from "@/reusable/lib/utils";
import { Player } from "@/reusable/models/Player";
import { useEffect, useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [runSearch, setRunSearch] = useState(false);
  const [countDown, setCountDown] = useState<NodeJS.Timeout | null>(null);
  const [friends, setFriends] = useState<Player[]>([]);
  const { addFriend } = useWs();
  const { session } = useAuth();

  useEffect(() => {
    if (countDown) clearTimeout(countDown);

    setCountDown(setTimeout(() => setRunSearch(true), 1000));
  }, [search]);

  useEffect(() => {
    if (runSearch && search) {
      multiFetch<Player[]>("express", `/user/get-user/${search}`).then((f) => {
        const filteredFriends = f.filter(
          (friend) => friend.username !== session?.user.username,
        );
        setFriends(filteredFriends);
      });
    }
    setRunSearch(false);
  }, [runSearch]);

  return (
    <div className="mt-10 w-full flex-1">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        type="text"
        placeholder="Nombre de Usuario"
      />
      <div className="friend-list mt-10">
        {friends.map((friend, i) => (
          <PlayerComponent key={i} player={friend} func={addFriend} />
        ))}
      </div>
    </div>
  );
}

"use client";

import Friend from "@/reusable/components/home/Friend";
import { useWs } from "@/reusable/context/WsContext";
import { multiFetch } from "@/reusable/lib/utils";
import { User } from "@/reusable/models/User";
import { useEffect, useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [runSearch, setRunSearch] = useState(false);
  const [countDown, setCountDown] = useState<NodeJS.Timeout | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const { setOMsg } = useWs();

  const addFriend = (username: string) => {
    setOMsg({
      action: "add-friend",
      payload: { username },
    });
  };

  useEffect(() => {
    if (countDown) clearTimeout(countDown);

    setCountDown(setTimeout(() => setRunSearch(true), 1000));
  }, [search]);

  useEffect(() => {
    if (runSearch && search) {
      multiFetch<User[]>("express", `/user/get-user/${search}`).then((f) =>
        setFriends(f),
      );
    }
    setRunSearch(false);
  }, [runSearch]);

  return (
    <div className="mt-10 w-full flex-1">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Nombre de Usuario"
      />
      <div className="friend-list mt-10">
        {friends.map((friend, i) => (
          <Friend
            key={i}
            username={friend.username}
            image={friend.image}
            func={addFriend}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type props = {
  getChange: (index: number) => void;
  defaultIndex?: number;
  className?: string;
};

const ToggleSwitch = ({ getChange, defaultIndex, className }: props) => {
  const [selected, setSelected] = useState(defaultIndex || 0);

  useEffect(() => {
    getChange(selected);
  }, [selected]);

  return (
    <div className={`toggle-switch ${className}`}>
      <h3
        onClick={() => setSelected(0)}
        className={selected == 0 ? "selected" : ""}
      >
        Juegos
      </h3>
      <h3
        className={selected == 1 ? "selected" : ""}
        onClick={() => setSelected(1)}
      >
        Amistades
      </h3>
    </div>
  );
};

export default ToggleSwitch;

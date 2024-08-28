import React, { useEffect, useRef } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { TileProps } from "../Types";

const letterWidth = 30;

const Tile: React.FC<TileProps> = ({ tile }) => {
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      tile.coordinates = {
        x1: rect.left,
        x2: rect.right,
        y1: rect.top,
        y2: rect.bottom,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div
      ref={tileRef}
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: tile.isHighlighted ? "gray" : "",
      }}
    >
      {tile.word}
    </div>
  );
};

export default Tile;

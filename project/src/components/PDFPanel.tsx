import React, { useMemo, useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import Tile from "./Tile";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import ChatPanel from './ChatPanel.js';

interface PDFPanelProps {
  extractedText: string;
}

const PDFPanel: React.FC<PDFPanelProps> = ({ extractedText }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const charsPerPage = 310;

  const pageBreaks = useMemo(() => {
    const breaks = [0];
    let currentIndex = 0;

    while (currentIndex < extractedText.length) {
      let spaceIndex = extractedText.lastIndexOf(
        " ",
        currentIndex + charsPerPage
      );
      if (spaceIndex <= currentIndex || spaceIndex === -1) {
        spaceIndex = Math.min(
          currentIndex + charsPerPage,
          extractedText.length
        );
      }
      breaks.push(spaceIndex);
      currentIndex = spaceIndex;
    }

    return breaks;
  }, [extractedText, charsPerPage]);

  const pages = pageBreaks.length - 1;

  const handlePrevious = () => {
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  const handleNext = () => {
    setCurrentPageIndex(Math.min(pages - 1, currentPageIndex + 1));
  };

  const currentPageText = extractedText.substring(
    pageBreaks[currentPageIndex],
    pageBreaks[currentPageIndex + 1]
  );

  const tiles = currentPageText.split(/\s+/).map((word, index) => ({
    id: index,
    isHighlighted: true,
    word: word,
  }));

  return (
    <>
   
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "0.5rem",
          padding: "1rem",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          height: `100%`,
          width: "75%",
          backgroundColor: "white",
          fontSize: "3.75rem",
          // border: "6px solid #ffafbd",
          textAlign: "left",
          lineHeight: "1.375",
          verticalAlign: "middle",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "flex-start",
            overflowY: "auto",
            fontSize: "7.5rem",
            lineHeight: "1.375",
            textAlign: "left",
          }}
        >
          {tiles.map((tile, index) => (
            <Tile key={index} tile={tile} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <IconButton onClick={handlePrevious} disabled={currentPageIndex <= 0}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={currentPageIndex >= pages - 1}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </div>
      <div
        style={{
          height: "1px",
          backgroundColor: "#d1d5db",
          margin: "1rem 0",
        }}
      ></div>{" "}
      <div
        style={{
          display: "grid",
          height: "100%",
          padding: "1rem",
          width: "25%",
          backgroundColor: "#ff007f",
          borderRadius: "0.5rem",
          placeItems: "center",
        }}
      ><ChatPanel/></div>
    </>
  );
};

export default PDFPanel;

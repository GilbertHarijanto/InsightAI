// src/components/PDFReader.js
import React, { useEffect, useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import GazeTracker from "../calibrations/GazeTracker";
import PDFPanel from "./PDFPanel";

interface ReadScreenProps {
  extractedText: string;
}

const ReadScreen: React.FC<ReadScreenProps> = ({ extractedText }) => {
  const [isCalibrated, setIsCalibrated] = useState(false);


  return (
    <>
      {isCalibrated ? (
        <PDFPanel extractedText={extractedText} />
      ) : (
        <GazeTracker setIsCalibrated={setIsCalibrated}/>
      )}
    </>
  );
};

export default ReadScreen;

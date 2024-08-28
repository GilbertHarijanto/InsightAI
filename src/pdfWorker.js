// src/pdfWorker.js
import * as pdfjsLib from 'pdfjs-dist';

// Ensure that the workerSrc is set to the appropriate path.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

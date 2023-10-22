import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

function PdfViewer({ pdfFile }) {
  // Ensure react-pdf is using the worker from the correct location
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const [numPages, setNumPages] = React.useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const containerStyle = {
    maxWidth: "100%",
    height: "600px",
    overflowY: "scroll",
  };

  const pageStyles = {
    width: "100%",
    height: "auto",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle} className="mt-5 p-4">
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <div style={pageStyles} key={`page_${index + 1}`} className="mb-6">
            <Page
              wrap={false}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}

export default PdfViewer;

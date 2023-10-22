import React, { useState } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PdfViewer from "./components/PdfViewer";
import { PDFDocument } from "pdf-lib";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleFileChange = (event) => {
    const newFiles = event.target.files;
    const updatedImageFiles = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      if (file.type === "application/pdf") {
        setPdfFile(file);
        setShowImageUpload(true);
      } else if (file.type === "image/jpeg" || file.type === "image/png") {
        updatedImageFiles.push(file);
      } else {
        alert("Please select a valid PDF, JPEG, or PNG file");
      }
    }

    if (updatedImageFiles.length > 0) {
      setImageFiles((prevImageFiles) => [
        ...prevImageFiles,
        ...updatedImageFiles,
      ]);
    }
  };

  const handleMergeAndDownload = async () => {
    if (imageFiles.length === 0) {
      alert("Please upload at least one image for merging.");
      return;
    }

    if (!pdfFile) {
      alert("Please upload a PDF file for merging.");
      return;
    }

    const mergedPdf = await mergePdfAndImages(pdfFile, imageFiles);

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(mergedPdf);
    downloadLink.download = "merged.pdf";
    downloadLink.click();
  };

  const mergePdfAndImages = async (pdfFile, imageFiles) => {
    const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());

    for (const imageFile of imageFiles) {
      const imageBytes = await imageFile.arrayBuffer();
      const image = await pdfDoc.embedPng(imageBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const mergedPdfBytes = await pdfDoc.save();

    return new Blob([mergedPdfBytes], { type: "application/pdf" });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold my-4 mx-5 text-center">
        PDF and Image Merger
      </h1>
      <h2 className="text-lg mb-6 mx-3">
        Easily merge images into a PDF document.
      </h2>

      <div className="flex mb-6 flex-wrap justify-center">
        <Button
          component="label"
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          style={{
            margin: "3px",
          }}
        >
          {showImageUpload ? "Change PDF" : "Upload PDF"}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </Button>

        {showImageUpload && (
          <Button
            component="label"
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            style={{
              margin: "3px",
            }}
          >
            Upload Images
            <input
              type="file"
              accept=".jpeg, .jpg, .png"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </Button>
        )}
      </div>

      {imageFiles.length > 0 && (
        <Button
          variant="contained"
          color="success"
          onClick={handleMergeAndDownload}
        >
          Merge and Download
        </Button>
      )}

      <div className="flex flex-wrap mb-6 mt-3 justify-center">
        {imageFiles.map((image, index) => (
          <div key={`image_${index}`} className="m-2">
            <img
              src={URL.createObjectURL(image)}
              alt={`Image ${index + 1}`}
              className="w-32 h-32 object-contain"
            />
          </div>
        ))}
      </div>

      {pdfFile && <PdfViewer pdfFile={pdfFile} />}
    </div>
  );
}

export default App;

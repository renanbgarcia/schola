import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfPreviewer = ({ src }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const fetchPdf = async () => {
      const loadingTask = pdfjs.getDocument(src);

      const pdf = await loadingTask.promise;

      const firstPageNumber = 1;

      const page = await pdf.getPage(firstPageNumber);



      // Prepare canvas using PDF page dimensions
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.height = canvas.parentNode.offsetHeight;

        const scale = canvas.parentNode.scrollHeight / page.getViewport(1.0).height;
        const scaledViewport = page.getViewport({ scale: scale, });
        const context = canvas.getContext('2d');
        console.log(canvas.parentNode.offsetHeight)
        // canvas.width = canvas.parentNode.offsetWidth;

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        const renderTask = page.render(renderContext);

        await renderTask.promise;
      }
    };

    fetchPdf();
  }, [src]);

  return (
    <canvas 
      ref={canvasRef}
      // width={window.innerWidth}
      height={300}
      // height={window.innerHeight}
    />
  );
}

PdfPreviewer.propTypes = {
  src: PropTypes.string
};

export default PdfPreviewer;
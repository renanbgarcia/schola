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
      const desiredWidth = canvas.parentNode.offsetWidth;
      const viewport = page.getViewport({ scale: 1, });
      const scale = desiredWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale: scale, });
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = canvas.parentNode.offsetWidth;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      const renderTask = page.render(renderContext);

      await renderTask.promise;
    };

    fetchPdf();
  }, [src]);

  return (
    <a href={src}>
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
    </a>

  );
}

PdfPreviewer.propTypes = {
  src: PropTypes.string
};

PdfPreviewer.defaultProps = {
  src: `${process.env.PUBLIC_URL}/helloworld.pdf`
};

export default PdfPreviewer;
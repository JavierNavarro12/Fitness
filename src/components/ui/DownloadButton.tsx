import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';

interface DownloadButtonProps {
  content: string;
  fileName?: string;
  htmlRef?: React.RefObject<HTMLElement>;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ content, fileName = 'informe.pdf', htmlRef }) => {
  const [state, setState] = useState<'idle' | 'downloaded'>('idle');
  const pdfBlobUrl = useRef<string | null>(null);

  const handleDownload = async () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40; // 40pt a cada lado
    const contentWidth = pageWidth - margin * 2;

    if (htmlRef && htmlRef.current) {
      // Limita el ancho del bloque HTML exportado
      const originalWidth = htmlRef.current.style.width;
      htmlRef.current.style.width = contentWidth + 'pt';
      await doc.html(htmlRef.current, {
        callback: function (doc) {
          // Restaurar el ancho original
          htmlRef.current!.style.width = originalWidth;
          // Añadir enlaces funcionales
          const links = htmlRef.current!.querySelectorAll('a');
          links.forEach(link => {
            const rect = link.getBoundingClientRect();
            const text = link.textContent || '';
            const href = link.getAttribute('href');
            if (href) {
              // Aproxima la posición en el PDF
              // (esto es una aproximación, puede requerir ajuste manual)
              const x = margin + 5;
              const y = rect.top - htmlRef.current!.getBoundingClientRect().top + margin + 10;
              doc.textWithLink(text, x, y, { url: href });
            }
          });
          // Descargar
          doc.save(fileName);
          // Blob para abrir
          const pdfBlob = doc.output('blob');
          if (pdfBlobUrl.current) {
            URL.revokeObjectURL(pdfBlobUrl.current);
          }
          pdfBlobUrl.current = URL.createObjectURL(pdfBlob);
          setState('downloaded');
        },
        margin: [margin, margin, margin, margin],
        autoPaging: 'text',
        html2canvas: { scale: 1.2, useCORS: true },
        x: margin,
        y: margin,
        width: contentWidth
      });
    } else {
      // Fallback: solo texto
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 15, 20);
      doc.save(fileName);
      setState('downloaded');
    }
  };

  const handleOpen = () => {
    if (pdfBlobUrl.current) {
      window.open(pdfBlobUrl.current, '_blank');
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <label className="label" style={{ cursor: state === 'downloaded' ? 'pointer' : 'pointer' }}>
          <input
            type="checkbox"
            className="input"
            onClick={state === 'idle' ? handleDownload : handleOpen}
          />
          <span className="circle"><svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19V5m0 14-4-4m4 4 4-4" />
            </svg>
            <div className="square" />
          </span>
          <span className="title">{state === 'idle' ? "Descargar" : "Abrir"}</span>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .label {
    background-color: transparent;
    border: 2px solid rgb(91, 91, 240);
    display: flex;
    align-items: center;
    border-radius: 19px;
    cursor: pointer;
    transition: all 0.4s ease;
    padding: 3px 10px 3px 3px;
    gap: 6px;
    height: 38px;
    overflow: hidden;
    min-width: 0;
    width: fit-content;
  }

  .label .input {
    display: none;
  }

  .label .title {
    font-size: 15px;
    color: #fff;
    margin-left: 6px;
    white-space: nowrap;
    position: static;
    right: unset;
    bottom: unset;
    text-align: center;
    transition: all 0.4s ease;
  }

  .label .circle {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background-color: rgb(91, 91, 240);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.4s ease;
    position: relative;
    box-shadow: 0 0 0 0 rgb(255, 255, 255);
    overflow: hidden;
    flex-shrink: 0;
  }

  .label .circle .icon {
    color: #fff;
    width: 18px;
    height: 18px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .label .circle .square {
    aspect-ratio: 1;
    width: 15px;
    border-radius: 2px;
    background-color: #fff;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .label .circle::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    background-color: #3333a8;
    width: 100%;
    height: 0;
    transition: all 0.4s ease;
  }

  .label:has(.input:checked) {
    width: 57px;
    animation: installed 0.4s ease 3.5s forwards;
  }

  .label:has(.input:checked)::before {
    animation: rotate 3s ease-in-out 0.4s forwards;
  }

  .label .input:checked + .circle {
    animation:
      pulse 1s forwards,
      circleDelete 0.2s ease 3.5s forwards;
    rotate: 180deg;
  }

  .label .input:checked + .circle::before {
    animation: installing 3s ease-in-out forwards;
  }

  .label .input:checked + .circle .icon {
    opacity: 0;
    visibility: hidden;
  }

  .label .input:checked ~ .circle .square {
    opacity: 1;
    visibility: visible;
  }

  .label .input:checked ~ .title {
    opacity: 0;
    visibility: hidden;
  }

  .label .input:checked ~ .title:last-child {
    animation: showInstalledMessage 0.4s ease 3.5s forwards;
  }

  @keyframes pulse {
    0% {
      scale: 0.95;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      scale: 1;
      box-shadow: 0 0 0 16px rgba(255, 255, 255, 0);
    }
    100% {
      scale: 0.95;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  @keyframes installing {
    from {
      height: 0;
    }
    to {
      height: 100%;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(-90deg) translate(27px) rotate(0);
      opacity: 1;
      visibility: visible;
    }
    99% {
      transform: rotate(270deg) translate(27px) rotate(270deg);
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes installed {
    100% {
      width: 150px;
      border-color: rgb(35, 174, 35);
    }
  }

  @keyframes circleDelete {
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes showInstalledMessage {
    100% {
      opacity: 1;
      visibility: visible;
      right: 56px;
    }
  }
`;

export default DownloadButton; 
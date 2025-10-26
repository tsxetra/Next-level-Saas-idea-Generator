import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { SaaSBriefData } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import LoadingSpinner from './LoadingSpinner';

interface SaaSBriefProps {
  brief: SaaSBriefData;
  logoUrl: string;
  onReset: () => void;
}

const SaaSBrief: React.FC<SaaSBriefProps> = ({ brief, logoUrl, onReset }) => {
  const briefRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const input = briefRef.current;
    if (!input) return;

    setIsDownloading(true);
    
    input.classList.add('pdf-export');

    try {
      // Use a fixed width on the container during render to ensure consistent output
      const originalWidth = input.style.width;
      input.style.width = '1024px'; 

      const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      input.style.width = originalWidth; // Reset width after capture

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasAspectRatio = canvas.height / canvas.width;
      const imgHeight = pdfWidth * canvasAspectRatio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      pdf.save(`${brief.name.replace(/\s+/g, '_')}_SaaS_Brief.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      input.classList.remove('pdf-export');
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in-up">
        <div ref={briefRef} className="bg-black p-8 md:p-12 max-w-4xl mx-auto border border-gray-800 rounded-lg">
            <style>{`
              .pdf-export {
                background-color: #ffffff !important;
                color: #000000 !important;
                border: none !important;
                border-radius: 0 !important;
              }
              .pdf-export h1, .pdf-export h2, .pdf-export h3, .pdf-export h4, .pdf-export p, .pdf-export span, .pdf-export div, .pdf-export button {
                color: #000000 !important;
                border-color: #e5e7eb !important;
              }
              .pdf-export .logo-bg {
                background-color: #f9fafb !important;
                ring-color: #f3f4f6 !important;
              }
              .pdf-export .prose {
                color: #374151 !important;
              }
              .pdf-export .text-gray-400 { color: #6b7280 !important; }
              .pdf-export .text-gray-500 { color: #6b7280 !important; }
              .pdf-export .text-gray-300 { color: #374151 !important; }
              .pdf-export .text-gray-200 { color: #1f2937 !important; }
            `}</style>

            <header className="text-center mb-12 pb-8 border-b border-gray-700">
                <img src={logoUrl} alt={`${brief.name} Logo`} className="w-32 h-32 md:w-40 md:h-40 rounded-2xl mx-auto mb-6 p-4 shadow-lg logo-bg bg-gray-900 ring-2 ring-gray-800" />
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif">{brief.name}</h1>
                    <p className="mt-3 text-lg text-gray-400 italic">"{brief.motive}"</p>
                </div>
            </header>


            <main className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-2">Executive Brief</h2>
                        <p className="text-base text-gray-300 whitespace-pre-wrap leading-relaxed prose">{brief.brief}</p>
                    </section>
                </div>

                <aside className="md:col-span-1 space-y-8">
                    <section>
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Brand Identity</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-200">Style</h3>
                                <p className="text-sm text-gray-400">{brief.brandIdentity.style}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-200">Color Palette</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {brief.brandIdentity.colorPalette.map(color => (
                                    <div key={color.hex} className="text-center">
                                        <div className="w-10 h-10 rounded-md border-2 border-gray-700" style={{ backgroundColor: color.hex }}></div>
                                        <span className="text-xs text-gray-500 mt-1 block">{color.name}</span>
                                    </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold text-gray-200">Typography</h3>
                                <p className="text-2xl text-gray-300" style={{ fontFamily: brief.brandIdentity.typography.fontFamily }}>
                                    {brief.brandIdentity.typography.fontFamily}
                                </p>
                                <p className="text-xs text-gray-400">{brief.brandIdentity.typography.description}</p>
                            </div>
                        </div>
                    </section>
                </aside>
            </main>
        </div>

        <div className="text-center mt-8 flex justify-center gap-4">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center justify-center px-6 py-2 border border-white text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
            >
              {isDownloading ? <LoadingSpinner /> : <DownloadIcon className="w-5 h-5 mr-2" />}
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
             <button
              onClick={onReset}
              className="inline-flex items-center justify-center px-6 py-2 border border-gray-700 text-base font-medium rounded-md text-gray-300 hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
            >
              Start Over
            </button>
        </div>
    </div>
  );
};

export default SaaSBrief;
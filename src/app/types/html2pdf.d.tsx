declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
    };
    jsPDF?: {
      unit?: string;
      format?: string | [number, number];
      orientation?: 'portrait' | 'landscape';
    };
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement | string): Html2Pdf;
    save(): void;
    toPdf(): Html2Pdf;
    output(type?: string, options?: any): string | Blob;
  }

  interface Html2PdfFunction extends Html2Pdf {
    (element?: HTMLElement | string, options?: Html2PdfOptions): Html2Pdf;
  }

  const html2pdf: Html2PdfFunction;
  export default html2pdf;
}

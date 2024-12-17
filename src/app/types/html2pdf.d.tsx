declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number;
    filename?: string;
    html2canvas?: { scale: number };
    jsPDF?: { unit: string; format: [number, number]; orientation: string };
  }

  interface Html2Pdf {
    (element: HTMLElement | string): Html2Pdf; // Callable signature
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement | string): Html2Pdf;
    save(): void;
  }

  const html2pdf: Html2Pdf;
  export default html2pdf;
}

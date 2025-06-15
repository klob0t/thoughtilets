// src/custom.d.ts

declare module 'dom-to-image-more' {
  // We can define the options object for better autocompletion
  interface DomToImageOptions {
    quality?: number;
    bgcolor?: string;
    fontEmbedCss?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
  }

  // Define the main object that the library exports
  const domtoimage: {
    toPng(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
    toJpeg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
    toSvg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
    toBlob(node: HTMLElement, options?: DomToImageOptions): Promise<Blob>;
  };

  export default domtoimage;
}
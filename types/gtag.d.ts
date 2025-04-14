declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params: {
        send_to?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

export {}; 
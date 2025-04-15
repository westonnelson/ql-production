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

export const gtag = (
  command: string,
  action: string,
  params: {
    send_to?: string;
    value?: number;
    [key: string]: any;
  } = {}
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(command, action, params);
  }
}; 
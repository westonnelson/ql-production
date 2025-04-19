declare module 'gtag' {
  interface GtagParams {
    send_to?: string;
    value?: number;
    currency?: string;
    transaction_id?: string;
    event_category?: string;
    event_label?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    [key: string]: any;
  }

  type Gtag = (command: string, action: string, params: GtagParams) => void;
}

declare global {
  interface Window {
    gtag: Gtag;
    dataLayer: any[];
  }
}

export {}; 
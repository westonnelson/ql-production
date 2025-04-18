import { useSearchParams } from 'next/navigation';

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface FunnelConfig {
  name: string;
  variant?: string;
  abTestId?: string;
  abTestVariant?: string;
}

export function getUtmParams(): UtmParams {
  const searchParams = useSearchParams();
  
  if (!searchParams) {
    return {};
  }
  
  return {
    source: searchParams.get('utm_source') || undefined,
    medium: searchParams.get('utm_medium') || undefined,
    campaign: searchParams.get('utm_campaign') || undefined,
    term: searchParams.get('utm_term') || undefined,
    content: searchParams.get('utm_content') || undefined,
  };
}

export function getUtmParamsFromUrl(url: string): UtmParams {
  const urlParams = new URLSearchParams(url.split('?')[1] || '');
  
  return {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
    term: urlParams.get('utm_term') || undefined,
    content: urlParams.get('utm_content') || undefined,
  };
}

export function getFunnelConfig(path: string): FunnelConfig {
  // Extract funnel name from path
  const funnelName = path.split('/')[1] || 'default';
  
  // You can add logic here to determine funnel variant and AB test parameters
  // based on the path, query parameters, or other factors
  
  return {
    name: funnelName,
    variant: undefined,
    abTestId: undefined,
    abTestVariant: undefined,
  };
}

export function getFunnelStep(path: string): string {
  // Extract step from path
  const parts = path.split('/');
  return parts[parts.length - 1] || 'start';
}

export function buildFunnelUrl(
  baseUrl: string,
  funnelName: string,
  step: string,
  utmParams?: UtmParams
): string {
  const url = new URL(baseUrl);
  
  // Add funnel path
  url.pathname = `/${funnelName}/${step}`;
  
  // Add UTM parameters if provided
  if (utmParams) {
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(`utm_${key}`, value);
      }
    });
  }
  
  return url.toString();
}

export function useUtmParams() {
  const searchParams = useSearchParams();

  return {
    utm_source: searchParams?.get('utm_source') || undefined,
    utm_medium: searchParams?.get('utm_medium') || undefined,
    utm_campaign: searchParams?.get('utm_campaign') || undefined,
    utm_term: searchParams?.get('utm_term') || undefined,
    utm_content: searchParams?.get('utm_content') || undefined,
  };
} 
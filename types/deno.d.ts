declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export interface ServeInit {
    port?: number;
    hostname?: string;
    handler: (request: Request) => Response | Promise<Response>;
  }
  
  export function serve(init: ServeInit): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.7.1' {
  export * from '@supabase/supabase-js';
}

declare module 'https://esm.sh/jsforce@1.11.1' {
  export * from 'jsforce';
} 
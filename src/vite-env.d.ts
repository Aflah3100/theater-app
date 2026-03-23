/// <reference types="vite/client" />

interface DesktopMediaSelection {
  name: string;
  path?: string;
  source?: string;
}

interface DesktopVlcResponse {
  ok: boolean;
  error?: string;
}

interface Window {
  desktop?: {
    isElectron: boolean;
    selectVideo: () => Promise<DesktopMediaSelection | null>;
    playInVlc: (payload: { path: string }) => Promise<DesktopVlcResponse>;
    closeApp: () => Promise<{ ok: boolean }>;
  };
}

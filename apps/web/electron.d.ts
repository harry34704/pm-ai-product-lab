type DesktopDialogFilter = {
  name: string;
  extensions: string[];
};

type DesktopSelectedFile = {
  name: string;
  path: string;
  mimeType: string;
  size: number;
  dataBase64: string;
};

interface Window {
  mockroom?: {
    system: {
      getAppInfo: () => Promise<{ name: string; version: string; userDataPath: string }>;
    };
    files: {
      openFileDialog: (options?: { title?: string; filters?: DesktopDialogFilter[] }) => Promise<DesktopSelectedFile | null>;
    };
    permissions: {
      requestMicrophoneAccess: () => Promise<"granted" | "denied" | "prompt">;
    };
  };
}

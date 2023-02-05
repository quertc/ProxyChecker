import { createContext, useState, useEffect, useMemo } from 'react';
import store from '../store/settings';

interface ProxiesContextProps {
  pattern: string;
  defaultProtocol: DefaultProtocolOrNull;
  url: string;
  timeout: number;
  threads: number;
  path: string;
  total: number;
  work: number;
  logs: LogPayload[];
  isCheckLoading: boolean,
  isDownloadLoading: boolean,
  setPattern: (pattern: string) => void;
  setDefaultProtocol: (defaultProtocol: DefaultProtocol) => void;
  setUrl: (url: string) => void;
  setTimeout: (timeout: number) => void;
  setThreads: (threads: number) => void;
  setPath: (path: string) => void;
  setTotal: (total: number) => void;
  setWork: React.Dispatch<React.SetStateAction<number>>;
  setLogs: React.Dispatch<React.SetStateAction<LogPayload[]>>;
  setIsCheckLoading: (isCheckLoading: boolean) => void;
  setIsDownloadLoading: (isDownloadLoading: boolean) => void;
}

export interface LogPayload {
  key: string,
  status: 'Success' | 'Error';
  message: string;
}

export type DefaultProtocol = 'http' | 'https' | 'socks4' | 'socks5';
type DefaultProtocolOrNull = DefaultProtocol | null;

export const ProxiesContext = createContext<ProxiesContextProps>({} as ProxiesContextProps);

interface ProxiesSettingsStore {
  pattern: string;
  defaultProtocol: DefaultProtocol;
  url: string;
  timeout: number;
  threads: number;
}

interface ProxiesStateProps {
  children: React.ReactNode;
}

export function ProxiesState({ children }: ProxiesStateProps) {
  const [pattern, setPattern] = useState('');
  const [defaultProtocol, setDefaultProtocol] = useState<DefaultProtocolOrNull>(null);
  const [url, setUrl] = useState('');
  const [timeout, setTimeout] = useState(0);
  const [threads, setThreads] = useState(0);
  const [path, setPath] = useState('');
  const [total, setTotal] = useState(0);
  const [work, setWork] = useState(0);
  const [logs, setLogs] = useState<LogPayload[]>([]);
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  function getSettingsValues(): Promise<ProxiesSettingsStore | null> {
    return store.get('proxies-settings');
  }

  useEffect(() => {
    getSettingsValues()
      .then(settings => {
        setPattern(settings?.pattern ?? 'protocol://login:password@ip:port');
        setDefaultProtocol(settings?.defaultProtocol ?? 'http');
        setUrl(settings?.url ?? 'https://api.ipify.org/');
        setTimeout(settings?.timeout ?? 10000);
        setThreads(settings?.threads ?? 500);
      })
      .catch(console.error);
  }, []);

  const value = useMemo(() => ({
    pattern,
    defaultProtocol,
    url,
    timeout,
    threads,
    path,
    total,
    work,
    logs,
    isCheckLoading,
    isDownloadLoading,
    setPattern,
    setDefaultProtocol,
    setUrl,
    setTimeout,
    setThreads,
    setPath,
    setTotal,
    setWork,
    setLogs,
    setIsCheckLoading,
    setIsDownloadLoading,
  }), [pattern, defaultProtocol, url, timeout, threads, path, total, work, logs, isCheckLoading, isDownloadLoading]);

  return (
    <ProxiesContext.Provider value={value}>
      {children}
    </ProxiesContext.Provider>
  );
}

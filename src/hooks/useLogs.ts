import { useContext, useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { LogPayload as ContextLogPayload, ProxiesContext } from '../context/ProxiesContext';

export type LogPayload = ContextLogPayload;

export function useLogs() {
  const { logs, setWork, setLogs } = useContext(ProxiesContext);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function handleLog() {
      await listen<LogPayload>('new-log', ({ payload }) => {
        setLogs(prev => [...prev, payload]);

        if (payload.status === 'Success') {
          setWork((prev: number) => prev + 1);
        }
      });
    }

    handleLog().catch(() => setIsError(true));
  }, [setWork, setLogs]);

  // Maybe it's better to stop listening to the event when the component is unmounted

  return { logs, isError };
}

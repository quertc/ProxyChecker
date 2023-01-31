import { useContext, useState } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';
import { ProxiesContext } from '../context/ProxiesContext';

function useFileSelect() {
  const { pattern, defaultProtocol, path, setPath, setTotal, setWork, setLogs, setIsCheckLoading } = useContext(ProxiesContext);
  const [isError, setIsError] = useState(false);

  async function selectFile() {
    try {
      const selected = await open({
        title: 'Select text file with proxies',
        filters: [{
          name: 'Text',
          extensions: ['txt'],
        }],
      });

      if (selected !== null && !Array.isArray(selected)) {
        setIsCheckLoading(true);
        setPath(selected);
        const proxies = await readTextFile(selected);
        const total = await invoke<number>('parse_and_filter_proxies_command', { proxies, pattern, defaultProtocol });
        setTotal(total);
        setWork(0);
        setLogs([]);
        setIsCheckLoading(false);
      }
    } catch (e) {
      setIsError(true);
      setIsCheckLoading(false);
    }
  }

  return { selectFile, path, isError };
}

export default useFileSelect;

import { useContext } from 'react';
import { Button } from '@mantine/core';
import { invoke } from '@tauri-apps/api/tauri';
import { ProxiesContext } from '../context/ProxiesContext';

function ActionButton() {
  const { url, timeout, path, total, isCheckLoading, isDownloadLoading, setWork, setLogs, setIsDownloadLoading } = useContext(ProxiesContext);

  // Move this to the hook (for other components too)
  async function checkProxies() {
    try {
      setIsDownloadLoading(true);
      setWork(0);
      setLogs([]);
      await invoke('check_proxies_command', { url, timeout });
      setIsDownloadLoading(false);
    } catch (e) {
      console.error(e);
      setIsDownloadLoading(false);
    }
  }

  return (
    <Button
      disabled={((!path || !total) && !isCheckLoading) || isDownloadLoading}
      loading={isCheckLoading}
      variant="gradient"
      gradient={{ from: 'indigo', to: 'cyan' }}
      fullWidth
      onClick={() => checkProxies()}
    >
      Check
    </Button>
  );
}

export default ActionButton;

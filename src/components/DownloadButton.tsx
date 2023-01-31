import { useContext } from 'react';
import { Button } from '@mantine/core';
import { save } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';
import { ProxiesContext } from '../context/ProxiesContext';

function DownloadButton() {
  const { work, isDownloadLoading } = useContext(ProxiesContext);

  async function downloadProxies() {
    try {
      const filePath = await save({
        filters: [{
          name: 'Text',
          extensions: ['txt'],
        }],
      });

      if (filePath !== null) {
        const result = await invoke<string>('download_proxies_command');
        await writeTextFile(filePath, result);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Button
      disabled={!work && !isDownloadLoading}
      loading={isDownloadLoading}
      variant="gradient"
      gradient={{ from: 'indigo', to: 'cyan' }}
      fullWidth
      onClick={() => downloadProxies()}
    >
      Download
    </Button>
  );
}

export default DownloadButton;

import { useContext, useState } from 'react';
import { useMantineTheme, Modal, Button } from '@mantine/core';
import { ProxiesContext } from '../context/ProxiesContext';
import settings from '../store/settings';
import PatternInput from './PatternInput';
import DefaultProtocolSelect from './DefaultProtocolSelect';
import UrlInput from './UrlInput';
import TimeoutInput from './TimeoutInput';

function SettingsModal() {
  const [opened, setOpened] = useState(false);
  const { pattern, defaultProtocol, url, timeout } = useContext(ProxiesContext);
  const theme = useMantineTheme();

  async function saveSettings() {
    try {
      await settings.set('proxies-settings', {
        pattern,
        defaultProtocol,
        url,
        timeout,
      });

      setOpened(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Modal
        title="Proxies settings"
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        shadow="md"
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.6}
        // Maybe it doesn't affect anything
        overlayBlur={3}
      >
        <PatternInput />
        <DefaultProtocolSelect mt="sm" />
        <UrlInput mt="sm" />
        <TimeoutInput mt="sm" />
        <Button
          disabled={!pattern || !defaultProtocol || !url || !timeout}
          fullWidth
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan' }}
          mt="xl"
          onClick={() => saveSettings()}
        >
          Save to settings file
        </Button>
      </Modal>

      <Button onClick={() => setOpened(true)} color="gray" fullWidth>Settings</Button>
    </>
  );
}

export default SettingsModal;

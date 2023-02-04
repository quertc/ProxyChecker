import { useContext } from 'react';
import { MantineNumberSize, Paper, SimpleGrid, Slider } from '@mantine/core';
import FileSelect from './FileSelect';
import SettingsModal from './SettingsModal';
import CheckButton from './CheckButton';
import { ProxiesContext } from '../context/ProxiesContext';

interface ProxiesCardProps {
  mb: MantineNumberSize;
}

function ProxiesCard({ mb }: ProxiesCardProps) {
  const { threads, setThreads } = useContext(ProxiesContext);

  return (
    <Paper p="md" mb={mb} withBorder>
      <FileSelect />
      <SimpleGrid cols={2} mt="md">
        <SettingsModal />
        <CheckButton />
      </SimpleGrid>
      <Slider
        value={threads}
        onChange={setThreads}
        min={1}
        max={500}
        styles={{ markLabel: { display: 'none' } }}
        mt="md"
      />
    </Paper>
  );
}

export default ProxiesCard;

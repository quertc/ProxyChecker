import { MantineNumberSize, Paper, SimpleGrid } from '@mantine/core';
import FileSelect from './FileSelect';
import SettingsModal from './SettingsModal';
import CheckButton from './CheckButton';

interface ProxiesCardProps {
  mb: MantineNumberSize;
}

function ProxiesCard({ mb }: ProxiesCardProps) {
  return (
    <Paper p="md" mb={mb} withBorder>
      <FileSelect />
      <SimpleGrid cols={2} mt="md">
        <SettingsModal />
        <CheckButton />
      </SimpleGrid>
    </Paper>
  );
}

export default ProxiesCard;

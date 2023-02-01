import { useContext } from 'react';
import { Paper, Text, Progress } from '@mantine/core';
import { ProxiesContext } from '../context/ProxiesContext';
import DownloadButton from './DownloadButton';

function Stats() {
  const { total, work } = useContext(ProxiesContext);

  const getPercentage = () => (work / total) * 100;

  const getColor = () => {
    const percentage = getPercentage() || 0;

    if (percentage < 20) return 'red';
    if (percentage < 40) return 'orange';
    if (percentage < 60) return 'yellow';
    if (percentage < 80) return 'teal';

    return 'green';
  };

  return (
    <Paper p="xl" withBorder>
      <Text size="xs" transform="uppercase" weight={700} color="dimmed">
        Working proxies
      </Text>
      <Text size="lg">
        {work}
        {' / '}
        {total}
      </Text>
      <Progress value={getPercentage() || 0} mt="md" mb="md" size="lg" radius="xl" color={getColor()} />
      <DownloadButton />
    </Paper>
  );
}

export default Stats;

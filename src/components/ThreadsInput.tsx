import { useContext } from 'react';
import { MantineNumberSize, NumberInput } from '@mantine/core';
import { IconCpu } from '@tabler/icons-react';
import { ProxiesContext } from '../context/ProxiesContext';

interface DefaultProtocolSelectProps {
  mt: MantineNumberSize;
}

function ThreadsInput({ mt }: DefaultProtocolSelectProps) {
  const { threads, setThreads } = useContext(ProxiesContext);

  return (
    <NumberInput
      value={threads}
      onChange={setThreads}
      label="Threads"
      placeholder="Enter the Enter the number of threads"
      min={1}
      max={500}
      icon={<IconCpu size={16} />}
      withAsterisk
      mt={mt}
      error={!threads ? 'Threads is required' : undefined}
    />
  );
}

export default ThreadsInput;

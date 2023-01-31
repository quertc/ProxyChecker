import { useContext } from 'react';
import { MantineNumberSize, NumberInput } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { ProxiesContext } from '../context/ProxiesContext';

interface DefaultProtocolSelectProps {
  mt: MantineNumberSize;
}

function TimeoutInput({ mt }: DefaultProtocolSelectProps) {
  const { timeout, setTimeout } = useContext(ProxiesContext);

  return (
    <NumberInput
      value={timeout}
      onChange={setTimeout}
      label="Timeout (ms)"
      placeholder="Enter the timeout"
      step={100}
      min={1000}
      max={60000}
      icon={<IconClock size={16} />}
      withAsterisk
      mt={mt}
      error={!timeout ? 'Timeout is required' : undefined}
    />
  );
}

export default TimeoutInput;

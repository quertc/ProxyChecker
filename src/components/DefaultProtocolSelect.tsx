import { useContext } from 'react';
import { MantineNumberSize, Select } from '@mantine/core';
import { IconShieldLock, IconChevronDown } from '@tabler/icons-react';
import { ProxiesContext } from '../context/ProxiesContext';

interface DefaultProtocolSelectProps {
  mt: MantineNumberSize;
}

function DefaultProtocolSelect({ mt }: DefaultProtocolSelectProps) {
  const { pattern, defaultProtocol, setDefaultProtocol } = useContext(ProxiesContext);

  const data = [
    { label: 'Http', value: 'http' },
    { label: 'Https', value: 'https' },
    { label: 'Socks4 (currently not supported)', value: 'socks4', disabled: true },
    { label: 'Socks5', value: 'socks5' },
  ];

  return (
    <Select
      disabled={pattern.includes('protocol')}
      label="Default protocol"
      placeholder="Choose the default protocol"
      withAsterisk
      value={defaultProtocol}
      onChange={setDefaultProtocol}
      icon={<IconShieldLock size={16} />}
      rightSection={<IconChevronDown size={16} />}
      data={data}
      mt={mt}
      styles={{
        input: {
          '&::-webkit-search-cancel-button': {
            display: 'none',
          },
        },
      }}
      error={!defaultProtocol ? 'Default protocol is required' : undefined}
    />
  );
}

export default DefaultProtocolSelect;

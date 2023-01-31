import { useContext } from 'react';
import { MantineNumberSize, TextInput } from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import { ProxiesContext } from '../context/ProxiesContext';

interface DefaultProtocolSelectProps {
  mt: MantineNumberSize;
}

function UrlInput({ mt }: DefaultProtocolSelectProps) {
  const { url, setUrl } = useContext(ProxiesContext);

  return (
    <TextInput
      label="Request url"
      placeholder="Enter the request url"
      withAsterisk
      value={url}
      onChange={event => setUrl(event.currentTarget.value)}
      icon={<IconLink size={16} />}
      mt={mt}
      error={!url ? 'Request url is required' : undefined}
    />
  );
}

export default UrlInput;

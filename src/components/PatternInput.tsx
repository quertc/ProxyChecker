import { useContext } from 'react';
import { TextInput, Tooltip } from '@mantine/core';
import { IconGrain, IconAlertCircle } from '@tabler/icons-react';
import { ProxiesContext } from '../context/ProxiesContext';

function PatternInput() {
  const { pattern, setPattern } = useContext(ProxiesContext);

  return (
    <TextInput
      label="Pattern"
      placeholder="Enter the pattern"
      withAsterisk
      value={pattern}
      onChange={event => setPattern(event.currentTarget.value)}
      icon={<IconGrain size={16} />}
      error={!pattern ? 'Pattern is required' : undefined}
      rightSection={(
        <Tooltip
          multiline
          width={360}
          color="blue"
          label="All proxies in the file must match this mask. You can use any separators, but prefer `:` and `@`. If you don't use the protocol in the pattern, the Default protocol below will be used by default for all proxies."
          position="top-end"
          withArrow
        >
          <div>
            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
          </div>
        </Tooltip>
      )}
    />
  );
}

export default PatternInput;

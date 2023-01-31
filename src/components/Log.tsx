import { Text, Code } from '@mantine/core';
import { LogPayload } from '../hooks/useLogs';

function Log({ status, message }: LogPayload) {
  return (
    <Text>
      $
      {' '}
      <Code color={status === 'Success' ? 'green' : 'red'}>{message}</Code>
    </Text>
  );
}

export default Log;

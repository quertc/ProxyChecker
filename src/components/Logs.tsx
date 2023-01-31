import React from 'react';
import { Card, Divider, Text } from '@mantine/core';
import { useLogs } from '../hooks/useLogs';
import Log from './Log';

function Logs() {
  const { logs, isError } = useLogs();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (cardRef.current && bottomRef.current) {
      const { scrollHeight, clientHeight } = cardRef.current;
      if (scrollHeight > clientHeight) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [logs]);

  return (
    <Card
      ref={cardRef}
      h="80vh"
      withBorder
      sx={{
        overflow: 'auto',
      }}
    >
      <Divider mb="xs" size="xs" label={<Text size="sm">Logs</Text>} />
      {logs.length === 0 && !isError && <Text size="sm">No logs yet</Text>}
      {isError && <Text size="sm" color="red">Error listening to new-log event</Text>}
      {logs.map(log => (
        <Log key={log.key} status={log.status} message={log.message} />
      ))}
      <div ref={bottomRef} />
    </Card>
  );
}

export default Logs;

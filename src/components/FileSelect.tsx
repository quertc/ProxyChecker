import { MantineTheme, Input } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import useFileSelect from '../hooks/useFileSelect';

function FileSelect() {
  const { selectFile, path, isError } = useFileSelect();

  function getColor(theme: MantineTheme) {
    if (isError) {
      return theme.colors.red;
    }

    if (path) {
      return 'inherit';
    }

    return theme.colors.dark[3];
  }

  return (
    <Input
      component="button"
      icon={<IconUpload size={18} />}
      styles={{
        input: {
          lineHeight: 'normal',
        },
      }}
      onClick={selectFile}
    >
      <Input.Placeholder sx={theme => ({
        color: getColor(theme),
      })}
      >
        {isError ? 'Error during file selection' : path || 'Select .txt file with proxies'}
      </Input.Placeholder>
    </Input>
  );
}

export default FileSelect;

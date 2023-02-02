import React, { useEffect, useState } from 'react';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import store from '../store/settings';

interface WrapperProps {
  children: React.ReactNode;
}

interface ConfigStore {
  theme: string;
}

function Wrapper({ children }: WrapperProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  const toggleColorScheme = async (value?: ColorScheme) => {
    try {
      const theme = value || (colorScheme === 'dark' ? 'light' : 'dark');
      await store.set('config', { theme });
      setColorScheme(theme);
    } catch (e) {
      console.error(e);
    }
  };

  function getConfigValues(): Promise<ConfigStore | null> {
    return store.get('config');
  }

  useEffect(() => {
    getConfigValues()
      .then(config => {
        if (config) {
          setColorScheme(config.theme as ColorScheme);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default Wrapper;

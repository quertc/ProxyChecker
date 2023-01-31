import { useMantineColorScheme, AppShell, Header, Group, Button, ActionIcon } from '@mantine/core';
import { IconBrandGithub, IconSun, IconMoonStars } from '@tabler/icons-react';
import { getName, getVersion } from '@tauri-apps/api/app';
import DarkBg from '../images/dark-bg.jpg';
import LightBg from '../images/light-bg.jpg';

const appName = await getName();
const appVersion = await getVersion();

interface ShellProps {
  children: React.ReactNode;
}

function Shell({ children }: ShellProps) {
  const colorSchemeContext = useMantineColorScheme();

  return (
    <AppShell
      padding="md"
      header={(
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20} position="apart">
            <Button component="a" href="https://github.com/" target="_blank" variant="default" leftIcon={<IconBrandGithub size={18} />}>
              {appName}
              {' v'}
              {appVersion}
            </Button>
            <ActionIcon
              onClick={() => colorSchemeContext.toggleColorScheme()}
              variant="default"
              size="lg"
              sx={theme => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
              })}
            >
              {colorSchemeContext.colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </Group>
        </Header>
      )}
      styles={theme => ({
        body: {
          backgroundImage: `url(${theme.colorScheme === 'dark' ? DarkBg : LightBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minWidth: '100vw',
          minHeight: '100vh',
        },
      })}
    >
      {children}
    </AppShell>
  );
}

export default Shell;

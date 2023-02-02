import { useMantineColorScheme, AppShell, Header, Group, Button, ActionIcon } from '@mantine/core';
import { IconBrandGithub, IconSun, IconMoonStars } from '@tabler/icons-react';
import PackageJson from '../../package.json';
import DarkBg from '../assets/dark-bg.webp';
import LightBg from '../assets/light-bg.webp';

interface ShellProps {
  children: React.ReactNode;
}

function Shell({ children }: ShellProps) {
  const colorSchemeContext = useMantineColorScheme();
  const appName = `ProxyChecker v${PackageJson.version}`;

  return (
    <AppShell
      padding="md"
      header={(
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20} position="apart">
            <Button component="a" href="https://github.com/quertc/ProxyChecker" target="_blank" variant="default" leftIcon={<IconBrandGithub size={18} />}>
              {appName}
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

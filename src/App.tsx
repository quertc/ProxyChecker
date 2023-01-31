import { Grid } from '@mantine/core';
import Wrapper from './components/Wrapper';
import Shell from './components/Shell';
import ProxiesCard from './components/ProxiesCard';
import Stats from './components/Stats';
import Logs from './components/Logs';
import { ProxiesState } from './context/ProxiesContext';

function App() {
  return (
    <Wrapper>
      <Shell>
        <Grid
          mx="md"
          sx={{
            opacity: 0.9,
          }}
        >
          <ProxiesState>
            <Grid.Col span={12} md={5}>
              <ProxiesCard mb="md" />
              <Stats />
            </Grid.Col>
            <Grid.Col span={12} md={7}>
              <Logs />
            </Grid.Col>
          </ProxiesState>
        </Grid>
      </Shell>
    </Wrapper>
  );
}

export default App;

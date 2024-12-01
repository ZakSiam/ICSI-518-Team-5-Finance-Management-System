import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import { Money, PaymentOutlined, Settings, Summarize } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DemoPageContent from './DemoPageContent';
import ChangePassword from './ChangePassword'; // Import the new ChangePassword component
import Password from '@mui/icons-material/Password';
import Logout from '@mui/icons-material/Logout';

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#EEEEF9',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: 'primary',
          paper: 'primary',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function Nav(props) {
  const { window } = props;
  const [pathname, setPathname] = React.useState('/dashboard');
  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={[
        {
          segment: 'Users',
          title: 'Profile',
          icon: <People />,
        },
        { kind: 'divider' },
        {
          segment: 'dashboard',
          title: 'Dashboard',
          icon: <Dashboard />,
        },
        { kind: 'divider' },
        {
          segment: 'summary',
          title: 'Summary',
          icon: <Summarize />,
        },
        { kind: 'divider' },
        {
          segment: 'Expenses',
          title: 'Expenses',
          icon: <Money />,
        },
        { kind: 'divider' },
        {
          segment: 'Recurring',
          title: 'Recurring',
          icon: <PaymentOutlined />,
        },
        { kind: 'divider' },
        {
          segment: 'Settings',
          title: 'Settings',
          icon: <Settings />,
          children: [
            {
              segment: 'Password',
              title: 'Change Password',
              icon: <Password />,
            },
          ],
          
        },


        { kind: 'divider' },
        {
          segment: 'Logout',
          title: 'Logout',
          icon: <Logout />,
        },

        
      ]}
      router={router}
      theme={customTheme}
      window={demoWindow}
      branding={{
        title: (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="h6" component="div">
              Finance
            </Typography>
          </Box>
        ),
      }}
    >
      <DashboardLayout>
        <Box sx={{ bgcolor: '#e6e6fa', minHeight: '100vh', p: 3 }}>
          <DemoPageContent pathname={pathname} router={router} />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

Nav.propTypes = {
  window: PropTypes.func,
};

export default Nav;

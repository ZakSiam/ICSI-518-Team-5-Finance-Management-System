import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Money, PaymentOutlined, Settings, Summarize } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DemoPageContent from './DemoPageContent';
import Password from '@mui/icons-material/Password';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

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
  const [pathname, setPathname] = React.useState('/Expenses');
  const navigate = useNavigate();

  // Wrap handleLogout in useCallback to memoize it
  const handleLogout = React.useCallback(() => {
    // Clear user session or token if necessary
    localStorage.removeItem('userToken'); // Example of clearing a token

    // Redirect to sign-in page
    navigate('/'); // Redirect to sign-in page
  }, [navigate]);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        if (path === '/Logout') {
          handleLogout(); // Call handleLogout on logout
        } else {
          setPathname(String(path));
        }
      },
    };
  }, [pathname, handleLogout]); // Include handleLogout in the dependency array

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={[
        {
          segment: 'Expenses',
          title: 'Expenses',
          icon: <Money />,
        },
        { kind: 'divider' },
        {
          segment: 'summary',
          title: 'Summary',
          icon: <Summarize />,
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
          onClick: () => handleLogout(),
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
        <Box
          sx={{
            bgcolor: 'linear-gradient(to bottom, lightblue, white)',
            minHeight: '100vh',
            p: 3,
            background: 'linear-gradient(to bottom, lightblue, white)',
          }}
        >
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

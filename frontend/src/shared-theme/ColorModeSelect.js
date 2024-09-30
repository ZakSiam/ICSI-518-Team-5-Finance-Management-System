import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function ColorModeToggle(props) {
  const { mode, setMode } = useColorScheme();

  
  if (!mode) {
    return null;
  }


  const handleToggle = (event) => {
    const newMode = event.target.checked ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save selected mode to localStorage
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={mode === 'dark'}
          onChange={handleToggle}
          color="primary"
        />
      }
      label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
      {...props}
    />
  );
}

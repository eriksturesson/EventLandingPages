import { blue, green, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
declare module '@mui/material/styles' {
   interface Palette {
      neutral: Palette['primary'];
      success: Palette['primary'];
      error: Palette['primary'];
   }

   interface PaletteOptions {
      neutral: PaletteOptions['primary'];
   }

   interface PaletteColor {
      darker?: string;
   }

   interface SimplePaletteColorOptions {
      darker?: string;
   }
}

export const eriksTheme = createTheme({
   palette: {
      primary: {
         // Purple and green play nicely together.
         main: blue[500],
         contrastText: '#ffffff', // white
      },
      secondary: {
         // This is green.A700 as hex.
         main: '#11cb5f',
         contrastText: '#ffffff', // white
      },
      neutral: {
         main: blue[500],
         contrastText: '#ffffff', // white
      },
      success: {
         main: green[500],
         contrastText: '#ffffff', // white
      },
      error: {
         main: red[500],
         contrastText: '#ffffff', // white
      },
   },
});

import { createTheme, responsiveFontSizes } from '@material-ui/core/styles'

const fontFamily = [
  'Poppins',
  'Arial',
  'Rubik',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
]

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: fontFamily.join(','),
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontDisplay: 'swap',
              fontWeight: 400,
              src: `local('Poppins'), url('/fonts/Poppins.ttf') format('truetype')`,
            },
          ],
        },
      },
      MuiCard: {
        root: {
          boxShadow: '1px 2px 5px rgba(117, 115, 115, 20%)',
          borderRadius: 10,
        },
      },
      MuiButton: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(71, 57, 55, 0.1)',
          },
        },
      },
    },
    palette: {
      primary: {
        main: '#edebed',
        contrastText: '#e13e3f',
        background: '#e13e3fb3',
      },
      secondary: {
        main: '#000000',
        contrastText: '#FFFFFF',
      },
      danger: {
        main: '#fe03b1',
      },
      background: {
        default: '#FFFFFF',
        primary: '#3c3c3c',
        secondary: '#e13e3f',
      },
      text: {
        default: '#FFFFFF',
        primary: '#473937',
        secondary: '#ababab',
      },
    },
    custom: {
      palette: {
        white: '#FFFFFF',
        lightBlue: '#4283c1',
        blue: '#29316c',
        darkBlue: '#2b2e3f',
        green: '#28C76F',
        pink: '#fe03b1',
        yellow: '#ffb418',
        border: '#e5e5e5',
      },
      gradient: {
        blue: 'linear-gradient(119.66deg, #008CEE 7.77%, #009FD8 81.36%)',
        background: 'linear-gradient(119.66deg, #20459d 7.77%, #0397d3 81.36%)',
      },
      layout: {
        topAppBarHeight: 100,
        maxFooterWidth: 780,
        maxDeskWidth: 1040,
      },
    },
  })
)

export default theme

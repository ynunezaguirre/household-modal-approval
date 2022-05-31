import { createGlobalStyle, DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      black: string;
      green: string;
      primary: string;
      white: string;
      disabled: string;
      whiteSoft: string;
      softGray: string;
      gray: string;
      lightBlue: string;
      blue: string;
      softGreen: string;
      red: string;
    };
    fonts: {
      Poppins: string;
    };
    sizes: {};
  }
}

const AppTheme: DefaultTheme = {
  colors: {
    black: '#1d262c',
    green: '#12d67d',
    primary: '#4800ff',
    white: '#fff',
    disabled: '#29304b',
    whiteSoft: '#dcdcdc',
    softGray: '#d2d5da',
    gray: '#eff2f8',
    lightBlue: '#e6f5ff',
    blue: '#0091ff',
    softGreen: '#ecfbf4',
    red: '#fa5a59',
  },
  fonts: {
    Poppins: "'Poppins', sans-serif",
  },
  sizes: {},
};

export const GlobalStyle = createGlobalStyle``;

export default AppTheme;

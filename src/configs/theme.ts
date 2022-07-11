import { createGlobalStyle, DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      black: string;
      green: string;
      primary: string;
      white: string;
      disabled: string;
      textDisabled: string;
      whiteSoft: string;
      softGray: string;
      gray: string;
      lightBlue: string;
      blue: string;
      softGreen: string;
      red: string;
      inputSmall: string;
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
    disabled: '#ababab',
    whiteSoft: '#dcdcdc',
    textDisabled: '#dedede',
    softGray: '#d2d5da',
    gray: '#eff2f8',
    lightBlue: '#e6f5ff',
    blue: '#0091ff',
    softGreen: '#ecfbf4',
    red: '#fa5a59',
    inputSmall: '#707071',
  },
  fonts: {
    Poppins: "'Poppins', sans-serif",
  },
  sizes: {},
};

export const GlobalStyle = createGlobalStyle``;

export default AppTheme;

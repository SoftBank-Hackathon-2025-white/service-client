import 'styled-components';
import { ColorKeyType } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: { [key in ColorKeyType]: string } & {
      // 주요 컬러셋 실제 키 (추가 필요시 theme.ts에서 참조)
      primary?: string;
      primaryLight?: string;
      primaryDark?: string;
      success?: string;
      successLight?: string;
      border1?: string;
      border2?: string;
      border3?: string;
      skyBg1?: string;
      skyBg2?: string;
      shadow1?: string;
      cardBorder?: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      full: string;
      xl: string;
      lg: string;
      md: string;
      '2xl': string;
    };
    shadow: {
      sm: string;
      md: string;
      lg: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  }
}

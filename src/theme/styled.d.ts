import 'styled-components';
import { ColorKeyType } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: { [key in ColorKeyType]: string } & {
      // 主要カラーセット実際のキー（追加が必要な場合はtheme.tsを参照）
      primary?: string;
      primaryLight?: string;
      primaryDark?: string;
      success?: string;
      successLight?: string;
      border1?: string;
      border2?: string;
      border3?: string;
      oceanBg1?: string;
      oceanBg2?: string;
      oceanBg3?: string;
      shadow1?: string;
      shadow2?: string;
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

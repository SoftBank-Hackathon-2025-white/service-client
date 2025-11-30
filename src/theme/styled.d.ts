import 'styled-components';
import { ColorKeyType } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: { [key in ColorKeyType]: string };
  }
}

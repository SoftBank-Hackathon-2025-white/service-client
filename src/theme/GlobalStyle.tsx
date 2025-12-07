import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif;
    color: ${(props) => props.theme.color.baseColor2};
  }
  * {
    box-sizing: border-box;
  }
  button {
    cursor: pointer;
    padding: 0;
    border: 0;
    outline: 0;
    background-color: transparent;
  }
  p {
    margin: 0;
  }
`;

export default GlobalStyle;

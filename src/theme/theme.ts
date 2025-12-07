const color = {
  // Base colors - 海テーマ（深いネイビー～明るいアクア）
  baseColor1: '#0A192F', // 深い海 (Dark Navy)
  baseColor2: '#112240', // 深海 (Deep Ocean)
  baseColor3: '#1A365D', // 海 (Ocean Blue)
  baseColor4: '#2C5282', // 海の中間 (Mid Ocean)
  baseColor5: '#4299E1', // 明るい海 (Light Ocean)
  baseColor6: '#63B3ED', // アクア (Aqua)
  baseColor7: '#90CDF4', // 明るいアクア (Light Aqua)
  baseColor8: '#BEE3F8', // 非常に明るいアクア (Very Light Aqua)
  baseColor9: '#EBF8FF', // 水泡 (Foam)
  white: '#FFFFFF',

  // Green colors - ターコイズテーマ (Teal/Turquoise)
  greenDeep: '#0D9488', // 深いターコイズ
  green1: '#14B8A6', // ターコイズ
  green2: '#5EEAD4', // 明るいターコイズ
  greenLight: '#CCFBF1', // 非常に明るいターコイズ

  // Status colors
  statusRunning: '#06B6D4', // 実行中 (Cyan)
  statusSuccess: '#10B981', // 成功 (Emerald)
  statusFailed: '#EF4444', // 失敗 (Red)
  statusQueued: '#F59E0B', // 待機 (Amber)
  statusUploading: '#8B5CF6', // アップロード中 (Purple)

  // Card colors - 透明な海の雰囲気
  cardBackground: 'rgba(6, 182, 212, 0.08)', // ターコイズ半透明
  cardBorder: 'rgba(6, 182, 212, 0.2)', // ターコイズボーダー

  // Primary colors - 海ブルー
  primary: '#0EA5E9', // Sky Blue
  primaryLight: '#7DD3FC', // Light Sky Blue
  primaryDark: '#0284C7', // Dark Sky Blue

  // Success colors
  success: '#10B981', // Emerald
  successLight: '#D1FAE5', // Light Emerald

  // Border colors - 海テーマ
  border1: '#BEE3F8', // Light Aqua
  border2: '#90CDF4', // Aqua
  border3: '#63B3ED', // Medium Aqua

  // Background colors - クリーンな海の雰囲気
  oceanBg1: '#F0FDFF', // 非常に明るい海
  oceanBg2: '#CFFAFE', // 明るい海の背景
  oceanBg3: '#A5F3FC', // ターコイズ背景

  // Shadow - 海の影
  shadow1: 'rgba(6, 182, 212, 0.3)', // ターコイズの影
  shadow2: 'rgba(14, 165, 233, 0.4)', // 青い影
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

const borderRadius = {
  full: '9999px',
  xl: '20px',
  lg: '16px',
  md: '8px',
  '2xl': '32px',
};

const shadow = {
  sm: '0 1px 2px rgba(0,0,0,0.04)',
  md: '0 4px 12px rgba(0,0,0,0.08)',
  lg: '0 8px 24px rgba(0,0,0,0.12)',
};

const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
};

export type ColorKeyType = keyof typeof color;

const theme = { color, spacing, borderRadius, shadow, fontSize };
export default theme;

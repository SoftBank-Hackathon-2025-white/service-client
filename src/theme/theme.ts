const color = {
  // Base colors - 바다 테마 (깊은 네이비 ~ 밝은 아쿠아)
  baseColor1: '#0A192F', // 깊은 바다 (Dark Navy)
  baseColor2: '#112240', // 심해 (Deep Ocean)
  baseColor3: '#1A365D', // 바다 (Ocean Blue)
  baseColor4: '#2C5282', // 바다 중간 (Mid Ocean)
  baseColor5: '#4299E1', // 밝은 바다 (Light Ocean)
  baseColor6: '#63B3ED', // 아쿠아 (Aqua)
  baseColor7: '#90CDF4', // 밝은 아쿠아 (Light Aqua)
  baseColor8: '#BEE3F8', // 매우 밝은 아쿠아 (Very Light Aqua)
  baseColor9: '#EBF8FF', // 물거품 (Foam)
  white: '#FFFFFF',

  // Green colors - 청록색 테마 (Teal/Turquoise)
  greenDeep: '#0D9488', // 깊은 청록색
  green1: '#14B8A6', // 청록색
  green2: '#5EEAD4', // 밝은 청록색
  greenLight: '#CCFBF1', // 매우 밝은 청록색

  // Status colors
  statusRunning: '#06B6D4', // 실행 중 (Cyan)
  statusSuccess: '#10B981', // 성공 (Emerald)
  statusFailed: '#EF4444', // 실패 (Red)
  statusQueued: '#F59E0B', // 대기 (Amber)
  statusUploading: '#8B5CF6', // 업로드 중 (Purple)

  // Card colors - 투명한 바다 느낌
  cardBackground: 'rgba(6, 182, 212, 0.08)', // 청록색 반투명
  cardBorder: 'rgba(6, 182, 212, 0.2)', // 청록색 테두리

  // Primary colors - 바다 블루
  primary: '#0EA5E9', // Sky Blue
  primaryLight: '#7DD3FC', // Light Sky Blue
  primaryDark: '#0284C7', // Dark Sky Blue

  // Success colors
  success: '#10B981', // Emerald
  successLight: '#D1FAE5', // Light Emerald

  // Border colors - 바다 테마
  border1: '#BEE3F8', // Light Aqua
  border2: '#90CDF4', // Aqua
  border3: '#63B3ED', // Medium Aqua

  // Background colors - 깨끗한 바다 느낌
  oceanBg1: '#F0FDFF', // 매우 밝은 바다
  oceanBg2: '#CFFAFE', // 밝은 바다 배경
  oceanBg3: '#A5F3FC', // 청록 배경

  // Shadow - 바다 그림자
  shadow1: 'rgba(6, 182, 212, 0.3)', // 청록색 그림자
  shadow2: 'rgba(14, 165, 233, 0.4)', // 파란 그림자
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

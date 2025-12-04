const color = {
  baseColor1: '#151619',
  baseColor2: '#252B39',
  baseColor3: '#353C4D',
  baseColor4: '#495264',
  baseColor5: '#7F8799',
  baseColor6: '#B2B7C4',
  baseColor7: '#CDD1DD',
  baseColor8: '#EBEDF2',
  baseColor9: '#F7F8FA',
  white: '#FFFFFF',
  greenDeep: '#437376',
  green1: '#86C3BB',
  green2: '#B5E9E2',
  greenLight: '#D5F7F2',
  statusRunning: '#3B82F6',
  statusSuccess: '#10B981',
  statusFailed: '#EF4444',
  statusQueued: '#F59E0B',
  statusUploading: '#8B5CF6',
  cardBackground: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',

  // 추가: 스타일에서 사용되는 주요 컬러, 파스텔 계통 등 실제 프로젝트 정의 기반 (예시값 수정 가능)
  primary: '#3B82F6',
  primaryLight: '#93C5FD',
  primaryDark: '#2563EB',
  success: '#22C55E',
  successLight: '#D1FAE5',
  border1: '#EBEDF2',
  border2: '#CDD1DD',
  border3: '#B2B7C4',
  skyBg1: '#F7FBFF',
  skyBg2: '#E3F0FD',
  shadow1: 'rgba(186,230,253,0.5)',
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

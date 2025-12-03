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
} as const;

export type ColorKeyType = keyof typeof color;

export default { color };

// 컬러 팔레트
const color = {
  baseColor1: '#151619',
  // baseColor2 = 기본 텍스트 Color
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
} as const;

export type ColorKeyType = keyof typeof color;

export default { color };

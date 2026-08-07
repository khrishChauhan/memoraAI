export const Colors = {
  background: '#0B0F14',
  surface: '#141A22',
  surfaceHighlight: '#1B222C',
  accent: '#5B8CFF',
  success: '#42D392',
  warning: '#F5B942',
  danger: '#FF5D5D',
  text: '#F5F7FA',
  textMuted: '#8E98A8',
  border: '#27303B',
  borderStrong: '#394353',
  overlay: 'rgba(11, 15, 20, 0.72)',
};

export const Typography = {
  largeTitle: { fontSize: 30, fontWeight: '700' as const, color: Colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.text },
  h1: { fontSize: 30, fontWeight: '700' as const, color: Colors.text },
  h2: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  caption: { fontSize: 15, fontWeight: '400' as const, color: Colors.textMuted },
  small: { fontSize: 15, fontWeight: '500' as const, color: Colors.textMuted },
};

export const Layout = {
  borderRadius: 24,
  padding: 16,
  spacing: 24,
};

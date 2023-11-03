const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const shared = {
  success: '#2ecc71',
  error: '#e74c3c',
}

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    ...shared
  },
  dark: {
    text: '#fff',
    background: '#fff',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    ...shared
  },
};

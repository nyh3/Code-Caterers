/*
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [require.resolve("expo-router/babel"), "module:react-native-dotenv"],
  };
};
*/
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-react', 'babel-preset-expo'],
    plugins: [
      '@babel/plugin-syntax-jsx',
      require.resolve('expo-router/babel'),
      'module:react-native-dotenv',
    ],
  };
};



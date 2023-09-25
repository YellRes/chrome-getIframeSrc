module.exports = {
  content: ["./src/**/*.tsx"],
  corePlugins: {
    // Remove Tailwind CSS's preflight style so it can use the antd's preflight instead (reset.css).
    preflight: false,
  },
  important: "#app",
  theme: {
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify paths to all of your components
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#3D7A3D',
        }
      }
    },
  },
  plugins: [],
}

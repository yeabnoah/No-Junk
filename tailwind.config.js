/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // Adjusted to cover all files in 'app' folder
    "./src/components/**/*.{js,jsx,ts,tsx}", // Ensure this path is correct if you have components there
    "./components/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./components/**/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#17151c",
        cardBg: "#222831",
      },
      fontFamily: {
        "outfit-thin": ["Outfit-Thin", "sans-serif"],
        "outfit-light": ["Outfit-Light", "sans-serif"],
        "outfit-regular": ["Outfit-Regular", "sans-serif"],
        "outfit-medium": ["Outfit-Medium", "sans-serif"],
        "outfit-semibold": ["Outfit-SemiBold", "sans-serif"],
        "outfit-bold": ["Outfit-Bold", "sans-serif"],
        "outfit-extrabold": ["Outfit-ExtraBold", "sans-serif"],
        "outfit-black": ["Outfit-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};

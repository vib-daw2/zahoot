/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        zahoot: {
          primary: "#381272"
        }
      },
      fontFamily: {
        main: ["Montserrat", "sans-serif"],
        zahoot: ["Marhey", "Montserrat", "sans-serif"]
      }
    },
  },
  plugins: [],
}


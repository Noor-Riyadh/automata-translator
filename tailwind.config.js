export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        in: "in 0.3s ease-out",
      },
      keyframes: {
        in: {
          "0%": { opacity: 0, transform: "translateX(-50%) translateY(-16px)" },
          "100%": { opacity: 1, transform: "translateX(-50%) translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

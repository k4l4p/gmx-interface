/* eslint-disable */

const range = require("lodash/range");
const fromPairs = require("lodash/fromPairs");
const merge = require("lodash/merge");
const defaultConfig = require("tailwindcss/defaultConfig");

const colors = {
  blue: {
    300: "#7885ff",
    400: "#4d5ffa",
    500: "#3d51ff",
    600: "#2d42fc",
    700: "#2e3dcd",
  },
  "cold-blue": {
    500: "#3a3f79",
    700: "#3a3f798f",
    900: "#1e203e",
  },
  "pale-blue": {
    100: "rgba(180,187,255, 0.1)",
    600: "rgba(180,187,255, 0.6)",
  },
  slate: {
    100: "#a0a3c4",
    500: "#3e4361",
    600: "#373c58",
    700: "#23263b",
    800: "#16182e",
    900: "#101124",
    950: "#08091b",
  },
  gray: {
    50: "#585866",
    100: "#e7e7e9",
    200: "#cfcfd3",
    300: "#b7b8bd",
    400: "#9fa0a7",
    500: "#878891",
    600: "#70707c",
    700: "#585866",
    800: "#585866",
    900: "#585866",
    950: "#585866",
  },
  yellow: {
    300: "#ffe166",
    500: "#f3b50c",
  },
  red: {
    400: "#ff637a",
    500: "#ff506a",
  },
  green: {
    300: "#56dba8",
    500: "#0ecc83",
  },
  white: "#ffffff",
  black: "#000000",
};

/**
 * @type {import('tailwindcss/types/config').PluginCreator}
 */
function injectColorsPlugin({ addBase, theme }) {
  function extractColorVars(colorObj, colorGroup = "") {
    return Object.keys(colorObj).reduce((vars, colorKey) => {
      const value = colorObj[colorKey];

      const visualColorKey = colorKey === "DEFAULT" ? "" : `-${colorKey}`;

      const newVars =
        typeof value === "string"
          ? { [`--color${colorGroup}${visualColorKey}`]: value }
          : extractColorVars(value, `-${colorKey}`);

      return { ...vars, ...newVars };
    }, {});
  }

  addBase({
    ":root": extractColorVars(theme("colors")),
  });
}

/**
 * @type {import('tailwindcss/types/config').PluginCreator}
 */
function customUtilsPlugin({ addUtilities, theme }) {
  addUtilities({
    ".scrollbar-hide": {
      "scrollbar-width": "none",
      "-ms-overflow-style": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  });
}

/**
 * @type {import('tailwindcss/types/config').PluginCreator}
 * @See https://www.notion.so/gmxio/Fonts-Clean-Up-13303574745d8015b115e03426827f3c
 */
function fontComponentsPlugin({ addComponents, addBase }) {
  addBase({
    ":root": {
      "--font-size-h1": '3.4rem',
      "--font-size-h2": '2.4rem',
      "--font-size-body-large": '1.6rem',
      "--font-size-body-medium": '1.4rem',
      "--font-size-body-small": '1.2rem',
      "--font-size-caption": '1rem',

      "--line-height-h1": '34px',
      "--line-height-h2": '24px',
      "--line-height-body-large": '2.1rem',
      "--line-height-body-medium": '1.8rem',
      "--line-height-body-small": '1.6rem',
      "--line-height-caption": '1.4rem',
    },
  });
  addComponents({
    ".text-h1": {
      fontSize: '3.4rem',
      lineHeight: 'auto',
    },
    ".text-h2": {
      fontSize: '2.4rem',
      lineHeight: 'auto',
    },
    ".text-body-large": {
      fontSize: '1.6rem',
      lineHeight: '2.1rem',
    },
    ".text-body-medium": {
      fontSize: '1.4rem',
      lineHeight: '1.8rem',
    },
    '.text-body-small': {
      fontSize: '1.2rem',
      lineHeight: '1.6rem',
    },
    '.text-caption': {
      fontSize: '1rem',
      lineHeight: '1.4rem',
    },
  });
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // @see https://tailwindcss.com/docs/customizing-spacing
    spacing: fromPairs(range(0, 96 + 1).map((spacing) => [spacing, `${spacing}px`])),
    borderRadius: merge(fromPairs(range(0, 96 + 1).map((borderRadius) => [borderRadius, `${borderRadius}px`])), {
      full: "9999px",
    }),
    fontSize: {
      12: "1.2rem",
      14: "1.4rem",
      15: "1.5rem",
      16: "1.6rem",
      24: "2.4rem",
      34: "3.4rem",      
    },
    lineHeight: {
      1: "1",
      2: "2",
      // Normal is browser dependent. See https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#normal
      base: "normal",
    },
    // @see https://tailwindcss.com/docs/customizing-colors
    colors: colors,
    textDecorationColor: colors,
    placeholderColor: {
      ...colors,
      gray: "rgb(117, 117, 117)",
    },
    // @see https://tailwindcss.com/blog/tailwindcss-v3-2#max-width-and-dynamic-breakpoints
    // "these features will only be available if your project uses a simple screens configuration."
    // So we just copy the default screens config
    screens: defaultConfig.theme.screens,
    extend: {
      gridTemplateColumns: fromPairs(
        range(200, 501, 50).map((space) => [`auto-fill-${space}`, `repeat(auto-fill, minmax(${space}px, 1fr))`])
      ),
    },
  },
  plugins: [injectColorsPlugin, customUtilsPlugin, fontComponentsPlugin],
};

import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
export default createVuetify({
  theme: {
    defaultTheme: "lumea",
    themes: {
      lumea: {
        dark: false,
        colors: {
          primary: "#64164F",
          secondary: "#7D2B67",
          background: "#FFF8FA",
          surface: "#FFFFFF",
          "surface-variant": "#FBE8EE",
          success: "#4F7A5B",
          warning: "#A36B25",
          error: "#B3261E",
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: "lg",
      elevation: 0,
      style: "font-weight: 700; letter-spacing: 0; text-transform: none;",
    },
    VCard: { rounded: "lg", elevation: 0 },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      bgColor: "#FFFFFF",
    },
    VDialog: { scrim: "rgba(74, 13, 55, .36)" },
    VChip: { rounded: "pill", size: "small" },
  },
});

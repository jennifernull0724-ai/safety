import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        // Base spacing (4px scale)
        "1": "4px",    // space-1
        "2": "8px",    // space-2
        "3": "12px",   // space-3
        "4": "16px",   // space-4
        "5": "20px",   // space-5
        "6": "24px",   // space-6
        "8": "32px",   // space-8
        "10": "40px",  // space-10
        "12": "48px",  // space-12
        "16": "64px",  // space-16
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        full: "9999px",
      },
      colors: {
        // Base surfaces
        bg: {
          primary: "#FFFFFF",
          secondary: "#F7F9FC",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
        },
        border: {
          default: "#E2E8F0",
        },
        // Semantic statuses (LOCKED)
        status: {
          valid: "#16A34A",
          expiring: "#F59E0B",
          expired: "#DC2626",
          revoked: "#7C2D12",
          blocked: "#991B1B",
        },
      },
    },
  },
  plugins: [],
};

export default config;

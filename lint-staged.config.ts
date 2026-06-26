import type { Configuration } from "lint-staged"

export default {
  "*.{ts,tsx,js,jsx,json}": ["bun lint"],
} satisfies Configuration

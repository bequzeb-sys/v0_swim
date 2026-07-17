export const COUNTRIES = [
  { code: "FR" },
  { code: "RE" },
  { code: "BE" },
  { code: "CH" },
  { code: "CA" },
  { code: "MA" },
  { code: "SN" },
  { code: "MU" },
] as const

export type CountryCode = (typeof COUNTRIES)[number]["code"]

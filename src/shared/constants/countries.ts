export type CountryCode = "es" | "fr" | "de" | "lt" | "it" | "gr" | "rs" | "si";

export type CountryOption = {
  code: CountryCode;
  name: string;
};

export const COUNTRIES: CountryOption[] = [
  { code: "es", name: "Spain" },
  { code: "fr", name: "France" },
  { code: "de", name: "Germany" },
  { code: "lt", name: "Lithuania" },
  { code: "it", name: "Italy" },
  { code: "gr", name: "Greece" },
  { code: "rs", name: "Serbia" },
  { code: "si", name: "Slovenia" },
];

export function isCountryCode(value: string): value is CountryCode {
  return COUNTRIES.some((country) => country.code === value);
}

export function getCountryName(code: CountryCode): string {
  return COUNTRIES.find((country) => country.code === code)?.name ?? code;
}

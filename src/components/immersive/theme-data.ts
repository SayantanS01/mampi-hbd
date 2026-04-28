export const themeStorageKey = "mampi-birthday-theme";

export const themes = [
  {
    id: "pastel",
    label: "Romantic Pastel",
    shortLabel: "Pastel",
    icon: "🌸",
    description: "Pink, lavender, pearl glow, and soft romance.",
  },
  {
    id: "luxury",
    label: "Dark Luxury",
    shortLabel: "Luxury",
    icon: "🥂",
    description: "Black velvet, champagne gold, and premium sparkle.",
  },
  {
    id: "cartoon",
    label: "Cute Cartoon",
    shortLabel: "Cartoon",
    icon: "🧸",
    description: "Bubbly colors, playful motion, and sweet doodles.",
  },
  {
    id: "galaxy",
    label: "Dreamy Galaxy",
    shortLabel: "Galaxy",
    icon: "🌌",
    description: "Stars, nebula light, glowing particles, and cosmic love.",
  },
] as const;

export type BirthdayTheme = (typeof themes)[number]["id"];

export function isBirthdayTheme(value: string | null): value is BirthdayTheme {
  return themes.some((theme) => theme.id === value);
}

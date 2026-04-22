/**
 * NUMERIQ.AI — Cheiro's Book of Numbers (Pure Edition)
 * Lucky Days, Colors, and Stones per Root Number.
 */

export interface LuckyElements {
  number: number;
  days: string[];
  colors: string[];
  stones: string[];
  luckyDates: number[];
}

export const LUCKY_ELEMENTS: Record<number, LuckyElements> = {
  1: {
    number: 1,
    days: ["Sunday", "Monday"],
    colors: ["Gold", "Yellow", "Bronze", "Golden Brown"],
    stones: ["Topaz", "Amber", "Yellow Diamond"],
    luckyDates: [1, 10, 19, 28]
  },
  2: {
    number: 2,
    days: ["Sunday", "Monday", "Friday"],
    colors: ["Green", "Pale Green", "Cream", "White"],
    stones: ["Pearls", "Moonstones", "Pale Green Jade"],
    luckyDates: [2, 11, 20, 29]
  },
  3: {
    number: 3,
    days: ["Thursday", "Friday", "Tuesday"],
    colors: ["Mauve", "Violet", "Purple", "Crimson"],
    stones: ["Amethyst"],
    luckyDates: [3, 12, 21, 30]
  },
  4: {
    number: 4,
    days: ["Saturday", "Sunday", "Monday"],
    colors: ["Electric Blue", "Grey", "Silver", "Metallic Shades"],
    stones: ["Sapphire (Light or Dark)"],
    luckyDates: [4, 13, 22, 31]
  },
  5: {
    number: 5,
    days: ["Wednesday", "Friday"],
    colors: ["Light Grey", "White", "Shiny Materials"],
    stones: ["Diamond", "White Sapphires", "Platinum/Silver Setting"],
    luckyDates: [5, 14, 23]
  },
  6: {
    number: 6,
    days: ["Tuesday", "Thursday", "Friday"],
    colors: ["Blue (all shades)", "Rose", "Pink"],
    stones: ["Turquoise", "Emerald"],
    luckyDates: [6, 15, 24]
  },
  7: {
    number: 7,
    days: ["Sunday", "Monday"],
    colors: ["Pale Green", "White", "Yellow", "Light Blue"],
    stones: ["Moonstone", "Cat's Eye", "Pearl"],
    luckyDates: [7, 16, 25]
  },
  8: {
    number: 8,
    days: ["Saturday", "Sunday", "Monday"],
    colors: ["Dark Grey", "Black", "Dark Blue", "Purple"],
    stones: ["Amethyst", "Dark Sapphire", "Black Pearl", "Black Diamond"],
    luckyDates: [8, 17, 26]
  },
  9: {
    number: 9,
    days: ["Tuesday", "Thursday", "Friday"],
    colors: ["Crimson", "Red", "Rose", "Pink"],
    stones: ["Ruby", "Garnet", "Bloodstone"],
    luckyDates: [9, 18, 27]
  }
};

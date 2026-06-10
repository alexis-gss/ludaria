import pluralize, { singular } from "pluralize";
import slugify from "slugify";

interface Stringable {
  /**
   * Trim a word based.
   * Examples:
   * - "  Some  $  in  the  GARDEN  !  " -> "Some $ in the GARDEN !"
   *
   * @return Stringable
   */
  normalize: () => Stringable;
  /**
   * Slugify a word based.
   * Examples:
   * - Some $ in the GARDEN ! -> some-dollar-in-the-garden
   *
   * @return Stringable
   */
  slug: () => Stringable;
  /**
   * Pascal case a word based.
   * Examples:
   * - some $ in the GARDEN ! -> Some $ in the GARDEN !
   *
   * @return Stringable
   */
  ucFirst: () => Stringable;
  /**
   * Upper case a word based.
   * Examples:
   * - Some $ in the GARDEN ! -> SOME $ IN THE GARDEN !
   *
   * @return Stringable
   */
  upperCase: () => Stringable;
  /**
   * Lower case a word based.
   * Examples:
   * - Some $ in the GARDEN ! -> some $ in the garden !
   *
   * @return Stringable
   */
  lowerCase: () => Stringable;
  /**
   * Capitalize all words.
   * Examples:
   * - some $ in the GARDEN -> Some $ In The Garden !
   *
   * @return Stringable
   */
  titleCase: () => Stringable;
  /**
   * Pascal case a word based.
   * Examples:
   * - Some $ in the GARDEN ! -> some$InTheGarden!
   *
   * @return Stringable
   */
  camelCase: () => Stringable;
  /**
   * Pascal case a word based.
   * Examples:
   * - some $ in the GARDEN ! -> Some$InTheGarden!
   *
   * @return Stringable
   */
  pascalCase: () => Stringable;
  /**
   * Kebab case a word based.
   * Examples:
   * - Some $ in the GARDEN ! -> some-$-in-the-garden-!
   *
   * @return Stringable
   */
  kebabCase: () => Stringable;
  /**
   * Snake case a word based.
   * Examples:
   * - Some $ in the GARDEN ! -> some_$_in_the_garden_!
   *
   * @return Stringable
   */
  snakeCase: () => Stringable;
  /**
   * Pluralize a word based.
   * Examples:
   * - word -> words
   * - story -> stories
   *
   * @return Stringable
   */
  plural: () => Stringable;
  /**
   * Singularize a word based.
   * Examples:
   * - words -> word
   * - stories -> story
   *
   * @return Stringable
   */
  singular: () => Stringable;
  /**
   * Replace a substring with another.
   * Examples:
   * - Some $ in the GARDEN ! -> Some $ in the POOL !
   *
   * @return Stringable
   */

  replace: (search: string, replacement: string) => Stringable;
  /**
   * Reverse the string.
   * Examples:
   * - Some $ in the GARDEN ! -> ! NEDRAG eht ni $ emoS
   *
   * @return Stringable
   */
  reverse: () => Stringable;
  /**
   * Repeat the string x times.
   * Examples:
   * - Some -> SomeSomeSome
   *
   * @return Stringable
   */

  repeat: (count: number) => Stringable;
  /**
   * Start with a prefix.
   * Examples:
   * - in the GARDEN ! -> Some $ in the GARDEN !
   *
   * @return Stringable
   */

  prepend: (prefix: string) => Stringable;
  /**
   * End with a suffix.
   * Examples:
   * - Some $ in the -> Some $ in the GARDEN !
   *
   * @return Stringable
   */

  append: (suffix: string) => Stringable;
  /**
   * Get the initials from the string.
   * Examples:
   * - Some $ in the GARDEN ! -> S$itG!
   *
   * @return Stringable
   */
  initials: () => Stringable;
  /**
   * Return the transformated string.
   *
   * @return string
   */
  value: () => string;
}

/**
 * Get a Stringable object.
 * Functions supported:
 * - normalize
 * - slug
 * - ucFirst
 * - upperCase
 * - lowerCase
 * - titleCase
 * - camelCase
 * - pascalCase
 * - kebabCase
 * - snakeCase
 * - plural
 * - singular
 * - replace
 * - reverse
 * - repeat
 * - prepend
 * - append
 * - initials
 * - value
 *
 * @param string initialValue
 * @return Stringable
 */
export default function str(initialValue: string): Stringable {
  let value = initialValue;

  // * HELPERS

  /**
   * Split string into multiple segments.
   * @param string string
   * @return string[]
   */
  const splitIntoSegments = (string: string): string[] =>
    string.split(/[-_\s]+/).filter(Boolean);

  // * METHODS

  return {
    normalize: (): Stringable => {
      value = value.trim().replace(/\s+/g, " ");
      return str(value);
    },
    slug: (): Stringable => {
      value = slugify(value, { lower: true, strict: true, trim: true });
      return str(value);
    },
    ucFirst: (): Stringable => {
      value = value.charAt(0).toUpperCase() + value.slice(1);
      return str(value);
    },
    upperCase: (): Stringable => {
      value = value.toUpperCase();
      return str(value);
    },
    lowerCase: (): Stringable => {
      value = value.toLowerCase();
      return str(value);
    },
    titleCase: (): Stringable => {
      value = value
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
      return str(value);
    },
    camelCase: (): Stringable => {
      const segments = splitIntoSegments(value);

      // If segments are empty.
      if (segments.length === 0) {
        value = "";
        return str(value);
      }

      // If single segment and already in camel case.
      if (segments.length === 1 && /^[a-z][a-zA-Z0-9]*$/.test(value)) {
        return str(value);
      }

      // first segment: lower first char, preserve internals
      const first = segments[0].charAt(0).toLowerCase() + segments[0].slice(1);

      // rest: uppercase first char; preserve internals if mixed case, otherwise lowercase internals
      const rest = segments.slice(1).map((p) => {
        if (!p) return "";
        const hasLower = /[a-z]/.test(p);
        const hasUpper = /[A-Z]/.test(p);
        const isMixed = hasLower && hasUpper;
        const head = p.charAt(0).toUpperCase();
        const tail = p.slice(1);
        return isMixed ? head + tail : head + tail.toLowerCase();
      });

      value = [first, ...rest].join("");
      return str(value);
    },
    pascalCase: (): Stringable => {
      const segments = splitIntoSegments(value);
      if (segments.length === 0) {
        value = "";
        return str(value);
      }

      // If already Pascal-ish, keep as is
      if (segments.length === 1 && /^[A-Z][a-zA-Z0-9]*$/.test(value)) {
        return str(value);
      }

      const converted = segments.map((p) => {
        const hasLower = /[a-z]/.test(p);
        const hasUpper = /[A-Z]/.test(p);
        const isMixed = hasLower && hasUpper;

        if (isMixed) {
          // preserve internal capitals, only uppercase first char
          return p.charAt(0).toUpperCase() + p.slice(1);
        }
        // normalize (capitalize first, lowercase rest)
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      });

      value = converted.join("");
      return str(value);
    },
    kebabCase: (): Stringable => {
      const words = value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(/[-_\s]+/)
        .filter(Boolean);
      value = words.map((w) => w.toLowerCase()).join("-");
      return str(value);
    },
    snakeCase: (): Stringable => {
      const words = value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(/[-\s]+|_+/)
        .filter(Boolean);

      value = words.map((w) => w.toLowerCase()).join("_");
      return str(value);
    },
    plural: (): Stringable => {
      value = pluralize(value);
      return str(value);
    },
    singular: (): Stringable => {
      value = singular(value);
      return str(value);
    },
    replace: (search: string, replacement: string): Stringable => {
      value = value.replace(new RegExp(search, "g"), replacement);
      return str(value);
    },
    reverse: (): Stringable => {
      value = value.split("").reverse().join("");
      return str(value);
    },
    repeat: (count: number): Stringable => {
      value = value.repeat(count);
      return str(value);
    },
    prepend: (prefix: string): Stringable => {
      const prefixValue = prefix + value;
      return str(prefixValue);
    },
    append: (suffix: string): Stringable => {
      const suffixValue = value + suffix;
      return str(suffixValue);
    },
    initials: (): Stringable => {
      const initialsValue = value
        .split(/\s+/)
        .map((word) => word.charAt(0))
        .join("");
      return str(initialsValue);
    },
    value: (): string => value,
  };
};

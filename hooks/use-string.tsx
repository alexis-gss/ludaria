import pluralize, { singular } from "pluralize";
import slugify from "slugify";

interface Stringable {
  trim: () => Stringable;
  slug: () => Stringable;
  ucFirst: () => Stringable;
  camelCase: () => Stringable;
  pascalCase: () => Stringable;
  kebabCase: () => Stringable;
  snakeCase: () => Stringable;
  capitalize: () => Stringable;
  upperCase: () => Stringable;
  lowerCase: () => Stringable;
  plural: () => Stringable;
  singular: () => Stringable;
  value: () => string;
}

const str = (initialValue: string): Stringable => {
  let value = initialValue;

  // * HELPERS

  /**
   * Split string into multiple segments.
   * @param string string
   * @returns string[]
   */
  const splitIntoSegments = (string: string): string[] =>
    string.split(/[-_\s]+/).filter(Boolean);

  // * METHODS

  return {
    trim: (): Stringable => {
      value = value.trim();
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
        } else {
          // normalize (capitalize first, lowercase rest)
          return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        }
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

    capitalize: (): Stringable => {
      if (!value) return str("");
      value = value[0].toUpperCase() + value.slice(1);
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

    plural: (): Stringable => {
      value = pluralize(value);
      return str(value);
    },

    singular: (): Stringable => {
      value = singular(value);
      return str(value);
    },

    value: (): string => value,
  };
};

export default str;
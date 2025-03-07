export const slugify = (text: string) => {
  return text
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // removes all the accents that are aggrupated in that codes range
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/_/g, "-") // Replace _ with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/-$/g, ""); // Remove trailing -
};

export function parameterize(input: string): string {
  return input
    .trim() // Remove leading and trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove all non-alphanumeric characters except spaces, hyphens, and underscores
    .replace(/[\s_-]+/g, "-") // Replace sequences of spaces, hyphens, and underscores with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export function createMenuFileName(name: string, filetype: string): string {
  const today = new Date();
  const file_suffix = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  return `${parameterize(name)}-${file_suffix}.${filetype}`;
}

export function timeToEmoji(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr ? parseInt(minuteStr, 10) : 0;

  // Normalize hour to a 12-hour format for Slack emoji
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
  const halfOrFull = minute < 15 || (minute >= 45 && minute <= 59) ? "" : "30";

  return `:clock${normalizedHour}${halfOrFull}:`;
}

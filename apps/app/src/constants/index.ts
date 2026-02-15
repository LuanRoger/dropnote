export const MAX_LENGHT_BASIC_NOTE = 1000;
export const MAX_LENGHT_ADVANCED_NOTE = 10_000;

export const EDITOR_DEBOUNCE_TIME_MS = 600;

export const LOCAL_NOTE_PREFIX = "dropnote.";

/**
 * Regex for validating slugs:
 * - ^ and $ ensure the entire string is matched
 * - [a-z0-9]+ requires the slug to start with one or more lowercase letters or digits
 * - (?:-[a-z0-9]+)* allows zero or more groups of a hyphen followed by one or more
 *   lowercase letters or digits (prevents leading, trailing, or consecutive hyphens)
 * - Only lowercase a–z, digits 0–9 and single hyphens between segments are allowed
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const BADGES_DATA = {
  SECURE: {
    label: "Secure",
    color: "#0F5A3B",
    description: "This note is protected with a password.",
  },
  UNLIMITED: {
    label: "Unlimited",
    color: "#1E40AF",
    description: "This note has extended character limit.",
  },
  SMART: {
    label: "Smart",
    color: "#9333EA",
    description: "This note is enhanced with AI features.",
  },
  PERMANENT: {
    label: "Permanent",
    color: "#047857",
    description: "This note will not be auto-deleted.",
  },
  COLLAB: {
    label: "Collab",
    color: "#B91C1C",
    description: "This note can be edited by multiple users in real-time.",
  },
};

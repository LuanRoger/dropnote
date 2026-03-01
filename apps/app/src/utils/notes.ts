import type { NoteModel } from "@repo/database/schemas/notes";
import type { Badge } from "@repo/editor/types/badge";
import { BADGES_DATA } from "@/constants";
import type { UpgradeFeature } from "@/types/notes";

export function mapNotePropertiesToBadges(note: NoteModel): Badge[] {
  const badges: Badge[] = note.badges.map((badge) => ({
    label: badge.label,
    color: badge.color,
    description: badge.description,
    isSpecial: badge.isSpecial,
  }));

  if (note.isPermanent) {
    badges.push(BADGES_DATA.PERMANENT);
  }
  if (note.hasPassword) {
    badges.push(BADGES_DATA.SECURE);
  }
  if (note.hasExtendedLimit) {
    badges.push(BADGES_DATA.EXTENDED);
  }
  if (note.aiCredits > 0) {
    badges.push(BADGES_DATA.SMART);
  }

  return badges;
}

export function getNoteOwnedFeatures(note: NoteModel): Set<UpgradeFeature> {
  const owned = new Set<UpgradeFeature>();
  if (note.isPermanent) {
    owned.add("permanent");
  }
  if (note.hasPassword) {
    owned.add("secure");
  }
  if (note.hasExtendedLimit) {
    owned.add("extended");
  }
  return owned;
}

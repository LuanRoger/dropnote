import type { NoteModel } from "@repo/database/schemas/notes";
import type { Badge } from "@repo/editor/types/badge";
import { BADGES_DATA } from "@/constants";

export function mapNotePropertiesToBadges(note: NoteModel): Badge[] {
  const badges: Badge[] = [...note.badges];

  if (note.isPermanent) {
    badges.push(BADGES_DATA.PERMANENT);
  }
  if (note.hasPassword) {
    badges.push(BADGES_DATA.SECURE);
  }
  if (note.hasExtendedLimit) {
    badges.push(BADGES_DATA.UNLIMITED);
  }
  if (note.aiCredits > 0) {
    badges.push(BADGES_DATA.SMART);
  }

  return badges;
}

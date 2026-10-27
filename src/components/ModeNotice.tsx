import { MODES, MODE_IDS } from "@/lib/modes";
import type { TocEntry } from "@/lib/markdown";
import { ModeSwitch } from "./ModeSwitch";

/**
 * One line per mode, rendered for all three and shown by CSS, so the page is fully static and the
 * text is right before hydration. Counts the sections the current mode folds away.
 */
export function ModeNotice({ toc }: { toc: TocEntry[] }) {
  const sections = toc.filter((e) => e.depth === 2);
  return (
    <div className="mode-notice">
      {MODES.map((m) => {
        const deeper = MODE_IDS.slice(MODE_IDS.indexOf(m.id) + 1);
        // Only sections a deeper mode would reveal count; beginner-only blocks are not "folded".
        const hidden = sections.filter(
          (e) => !e.modes.includes(m.id) && e.modes.some((x) => deeper.includes(x)),
        ).length;
        return (
          <p key={m.id} data-mode-text={m.id}>
            <b>{m.label} mode.</b>{" "}
            {hidden === 0
              ? "Showing the full explainer."
              : `${hidden} of ${sections.length} sections folded away${
                  deeper.length ? `; switch to ${deeper.map((d) => MODES.find((x) => x.id === d)!.label).join(" or ")} to read them.` : "."
                }`}
          </p>
        );
      })}
      <ModeSwitch />
    </div>
  );
}

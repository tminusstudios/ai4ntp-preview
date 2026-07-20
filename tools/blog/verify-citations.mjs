#!/usr/bin/env node
/* Citation verifier: proves every source.citations entry in content/posts.json actually
   exists in sessions/<id>/transcript.md, at that timestamp, in those words.

   WHY THIS IS A SCRIPT AND NOT A CHECKLIST ITEM:
   The moat is that every claim traces to a timestamp in a recording we own. A checklist
   item that says "spot-check three citations" is the step that gets skipped, and a wrong
   citation looks exactly like a right one. Worse, sessions/<id>/catchup.md and faqs.md
   carry timestamps on the TRIMMED REPLAY clock, which runs minutes ahead of the recording
   (006: catchup [0:05] == transcript [2:16]; catchup [42:25] == transcript [49:19], and
   the offset is not constant). Harvesting evidence from those files, which is the most
   tempting shortcut in the input set, silently produces citations that are all wrong and
   that no human review would catch. So the check is mechanical and runs on every build.

   RULE: transcript.md is the ONLY valid timestamp source.

   Run standalone:  node tools/blog/verify-citations.mjs
   Also runs automatically inside tools/directory/generate.mjs. */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO } from '../lib/site.mjs';

const tsToSec = (ts) => String(ts).trim().split(':').map(Number).reverse()
  .reduce((acc, v, i) => acc + v * [1, 60, 3600][i], 0);

// Normalize for comparison: smart quotes, dashes, and whitespace vary between the
// transcript and a hand-typed JSON quote without changing the words.
const norm = (s) => String(s)
  .replace(/[‘’ʼ]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[–—]/g, '-')
  .replace(/…/g, '...')
  .replace(/\*/g, '')       // transcripts bold tool names mid-sentence (**n8n**)
  .replace(/\s+/g, ' ')
  .toLowerCase()
  .trim();

/* Parse a transcript into an array of turns: [{ sec, speaker, text, explicit }].

   THREE house formats exist, none of them agreed upon:
     006/005:  **[5:03] Ian:** text          (timestamp first, on every line)
     002:      **Ian · 08:29** — text        (speaker first, middot, on every line)
     004:      **Justin:** [00:00] text      (speaker first, SPARSE, and see below)

   004 is the awkward one and it breaks two naive assumptions:

   1. Only ~25 of its 74 speaker lines open with a timestamp. The rest belong to the
      region opened by the last one above them, so an untimestamped turn INHERITS the
      open timestamp rather than being dropped.
   2. Of its 57 timestamps, 32 sit INLINE MID-PARAGRAPH ("...for a client. [23:00] This
      might look like a lot..."), each opening a new region inside one speaker's turn.

   So a turn is split on inline markers into sub-turns. Without this, two thirds of 004
   is silently uncitable and any post drawn from it quietly loses its evidence, which is
   the one thing this pipeline cannot afford to lose.

   Hours are supported ([1:03:47]); a naive \d:\d\d match breaks at the hour mark. */
const TS = '(\\d{1,2}(?::\\d{2}){1,2})';
const FORMATS = [
  { name: 'ts-first', re: new RegExp(`^\\*\\*\\[${TS}\\]\\s*([^:*]+):\\*\\*\\s*(.*)$`), ts: 1, sp: 2, tx: 3 },
  { name: 'middot', re: new RegExp(`^\\*\\*([^*·]+?)\\s*·\\s*${TS}\\*\\*\\s*[-–—]?\\s*(.*)$`), ts: 2, sp: 1, tx: 3 },
  { name: 'speaker-first', re: new RegExp(`^\\*\\*([^*:]+):\\*\\*\\s*(?:\\[${TS}\\])?\\s*(.*)$`), ts: 2, sp: 1, tx: 3 },
];
const INLINE_TS = new RegExp(`\\[${TS}\\]`, 'g');

export function parseTranscript(md) {
  const turns = [];
  let last = null;
  const push = (sec, speaker, text, explicit) => {
    const t = text.trim();
    if (sec === null || !t) return;
    turns.push({ sec, speaker, text: t, explicit });
  };

  for (const line of md.split('\n')) {
    for (const f of FORMATS) {
      const m = f.re.exec(line);
      if (!m) continue;
      const speaker = m[f.sp].trim();
      const leading = m[f.ts];
      if (leading) last = tsToSec(leading);

      // Split the turn on any inline [ts] markers: each opens a new region.
      const body = m[f.tx];
      let cursor = 0, sec = last, explicit = Boolean(leading), hit;
      INLINE_TS.lastIndex = 0;
      while ((hit = INLINE_TS.exec(body))) {
        push(sec, speaker, body.slice(cursor, hit.index), explicit);
        sec = last = tsToSec(hit[1]);
        explicit = true;
        cursor = hit.index + hit[0].length;
      }
      push(sec, speaker, body.slice(cursor), explicit);
      break;
    }
  }
  return turns;
}

// All turns belonging to the region opened at `sec`.
const turnsAt = (turns, sec) => turns.filter(t => t.sec === sec);

// Does `quote` appear in `text`, allowing "..." as an explicit elision marker?
const quoteIn = (quote, text) => {
  const hay = norm(text);
  let cursor = 0;
  for (const f of norm(quote).split('...').map(s => s.trim()).filter(Boolean)) {
    const at = hay.indexOf(f, cursor);
    if (at === -1) return false;
    cursor = at + f.length;
  }
  return true;
};

export function verifyCitations({ quiet = false } = {}) {
  const raw = JSON.parse(readFileSync(resolve(REPO, 'content/posts.json'), 'utf8'));
  const errors = [];
  let checked = 0;

  for (const p of raw.posts) {
    if (p.status !== 'published') continue;
    const sid = p.source?.session;
    const cites = p.source?.citations || [];
    if (!sid || !cites.length) continue;

    const tPath = resolve(REPO, `sessions/${sid}/transcript.md`);
    if (!existsSync(tPath)) {
      errors.push(`${p.slug}: sessions/${sid}/transcript.md does not exist. RULE: no transcript, no post.`);
      continue;
    }
    const T = parseTranscript(readFileSync(tPath, 'utf8'));
    if (!T.length) { errors.push(`${p.slug}: could not parse any timestamps out of sessions/${sid}/transcript.md`); continue; }

    for (const c of cites) {
      checked++;
      const sec = tsToSec(c.ts);
      const region = turnsAt(T, sec);
      if (!region.length) {
        // The signature failure of a replay-clock timestamp copied from catchup.md.
        const near = [...new Set(T.filter(t => quoteIn(String(c.quote).split('...')[0], t.text)).map(t => t.sec))];
        const hint = near.length
          ? ` Those words appear at ${near.map(fmt).join(' / ')} instead. catchup.md/faqs.md use the REPLAY clock; cite transcript.md only.`
          : ' No such timestamp in the transcript.';
        errors.push(`${p.slug} [${c.ts} ${c.speaker}]: no transcript entry at this timestamp.${hint}`);
        continue;
      }
      // The quote must live in ONE turn of the region, spoken by the cited speaker, OR
      // attributed to them inline inside another speaker's turn ("Justin: Ian, how much
      // do you spend? Ian: about $29..."), which is a real pattern when someone answers
      // inside another speaker's paragraph.
      const ok = region.some(t => {
        const markerOk = norm(t.speaker).includes(norm(c.speaker)) || norm(c.speaker).includes(norm(t.speaker));
        const inlineOk = c.speaker && norm(t.text).includes(norm(c.speaker) + ':');
        return (markerOk || inlineOk) && quoteIn(c.quote, t.text);
      });
      if (ok) continue;

      const spoke = region.find(t => quoteIn(c.quote, t.text));
      if (spoke) {
        errors.push(`${p.slug} [${c.ts}]: speaker is "${c.speaker}" but those words are spoken by "${spoke.speaker}".`);
      } else {
        const said = region.map(t => `${t.speaker}: ${t.text}`).join(' | ');
        errors.push(`${p.slug} [${c.ts} ${c.speaker}]: quote is not in the transcript verbatim.\n      quote: "${c.quote}"\n      said:  "${said.slice(0, 400)}${said.length > 400 ? '...' : ''}"\n      (Mark any elision with "..." . An unmarked splice is a fabricated quote.)`);
      }
    }
  }

  if (errors.length) {
    console.error(`\n[citations] ${errors.length} FAILED of ${checked} checked:\n`);
    for (const e of errors) console.error('  - ' + e);
    console.error('\nRULE: every number traces to a timestamp. If you cannot cite it, cut it.\n');
    return { ok: false, checked, errors };
  }
  if (!quiet) console.log(`[citations] ${checked} citations verified verbatim against the transcripts.`);
  return { ok: true, checked, errors };
}

function fmt(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + ':' + String(s).padStart(2, '0');
}

// Standalone run
if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(verifyCitations().ok ? 0 : 1);
}

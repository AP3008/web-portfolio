# 3D desk

Every object's position, scale, rotation and camera target is set in `DESK_OBJECTS` (`src/lib/constants.ts`). Edit them there.

## Objects

| ID | hudLabel | Model (`public/models/`) | Opens |
| --- | --- | --- | --- |
| `monitor` | Terminal | `monitor.glb` | Terminal overlay |
| `keyboard` | Featured Projects | `keyboard.glb` | `projects` |
| `notebook` | About Me | `notebook.glb` | `about` |
| `papers` | Resume | `papers.glb` | `resume` |
| `shaker` | Body Building | `protien_shaker.glb` | `fitness` (linked with `protein_powder`) |
| `protein_powder` | Body Building | `protein_powder.glb` | `fitness` (linked with `shaker`) |
| `chessboard` | Chess Board | `chess_borad.glb` | `chess` |
| `phone` | Socials | `phone.glb` | `socials` |
| `linux_char` | Theme Store | `linux-char.glb` | `theme` |
| `desk_lamp`, `desk_plant`, `pen_holder`, `computer_mouse` | — | decorative | `interactive: false` |

The desk (`computer_desk.glb`) and room (`empty_bedroom.glb`) are loaded separately (`ASSETS` in `constants.ts`). The `protien_shaker` and `chess_borad` filename typos are real; keep them. The GLBs total about 47MB (`pen_holder` and `chess_borad` are the largest). Keep textures at 2K or below.

**Performance target:** 60 FPS on modern laptops, never below 40.

## Terminal (`TerminalOverlay.tsx`)

PowerShell look: white text, `PS C:\Users\Adam>` prompt. Keystrokes go to a hidden input, and the cursor is a blinking `|` made with CSS keyframes. Clicking anywhere refocuses the input.

| Command | Action |
| --- | --- |
| `help` | List commands |
| `ls` | List interactive objects |
| `whoami` | Bio summary |
| `clear` | Clear output |
| `cd <object>` | Focus that object and open its modal |
| `exit` | `returnToDesk()` |
| `vim`, `nvim`, `emacs`, `ghostty` | Easter eggs |

`cd` resolves names through the `objectAliases` map in the same file (e.g. `projects`→keyboard, `fitness`→shaker, `socials`→phone).

## Modals

- **Projects** (`ProjectPortalModal`): a card for each entry in `data/projects.tsx` showing its latest commit, plus a "Most Recent Commit: web-portfolio" section. Commit data comes from `/api/github-commits`. See `docs/adding-a-project.md`.
- **Resume** (`ResumeModal`): the PDF in an `<iframe>` floating over a blurred backdrop, with a download button.
- **About** (`AboutModal`): content from `data/about.ts`.
- **Fitness** (`FitnessModal`): the title plus the **Live Pulse** card (`LivePulseCard`), which fetches `/api/whoop` on open and shows one Whoop day's recovery % (coloured foam ≥67 / gold 34–66 / love ≤33), day strain (/21) and sleep performance %. Its footer links to Hevy (`https://hevy.com/user/adamp3008`). While loading, the card shows "—" and empty bars. If the request fails, only the Hevy link shows, centred.
- **Chess** (`ChessModal`): the Morphy Opera Game puzzle (1858). The FEN is the position *before* 1. Qb8+ (solution: 1. Qb8+ Nxb8 2. Rd8#), stored in `data/chess.ts`. Wooden board colours `#f0d9b5` / `#b58863`, piece images in `public/chess_pieces/` (queens at 150%, other pieces at 80%).
- **Socials** (`SocialsModal`): a phone frame drawn in CSS (black, orange border and glow) listing links from `data/socials.ts`, each with an inline SVG `iconPath`.
- **Theme** (`ThemeModal`): reuses `ThemePicker` from the landing page.

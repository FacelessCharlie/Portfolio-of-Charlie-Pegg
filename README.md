# Your Portfolio Website — Start Here

This is a **starter template** for your DSDN142 Project 3 website. It is
deliberately simple and unfinished, full of `REPLACE` placeholders. Your job is
to turn it into *your* site: your name, your words, your projects, your look.

You will do most of that by talking to **Claude Code** in plain English.

*A quick note: this guide (and the starter files) was written by **Claude** — the
same kind of AI you'll build your site with — not by your lecturer. So if the
voice sounds a little different from Phoebe's, that's why.*

---

## Your first five minutes

New to all this? Here's the whole loop — that's really all there is to it:

1. **Open this folder in Claude Code.** *(Your tutor's video shows exactly where
   to click — it looks a little different on each computer.)*
2. **Say hi in the chat.** Claude will greet you and ask what you'd like to do.
   Just answer in your own words — there's no quiz.
3. **See your site:** double-click `index.html` — it opens in your browser.
4. **Ask for a change**, then **refresh the browser** (Cmd+R) to see it.
5. **Don't like it?** Say *"undo that."* You really can't break anything.

That's the rhythm: **ask → refresh → repeat.** Most of the time you just
double-click `index.html` and there's nothing to set up. If your site ever grows
into something fancier that needs a bit more, Claude will handle it and explain.
Everything below is just detail.

---

## What's in this folder

| File | What it is |
| --- | --- |
| `index.html` | The **home page**: your intro, an *about me* section, and a grid of your projects. |
| `project.html` | A **single project page** (title, images, description). To add more, just tell Claude *"add another project"*. |
| `styles.css` | The **look** of the site — colours, fonts, spacing. Design tokens are at the very top. |
| `script.js` | A tiny bit of JavaScript (the mobile menu + the footer year). You rarely need to touch it. |
| `assets/` | Your **images** live here. The placeholders are `.svg` files — replace them with your own. |
| `CLAUDE.md` | Sets up **how Claude helps you** — as a patient tutor that explains what it does. You don't need to edit it. |
| `PROJECT.md` | **Your project notes**, kept up to date by Claude (your goals, decisions, and what's next). It appears once you start. |
| `glossary.md` | A **tiny glossary** of words like "HTML", "file", "browser" — open it whenever a term is unfamiliar. |

---

## The workflow: build it with Claude

Open this folder in **Claude Code** (Claude Desktop → Code) and just ask
for what you want, one step at a time. Claude edits the files for you.

When you open the folder, Claude will say hello and ask what you'd like to do —
so you can just **start talking**. As you work, it keeps notes in `PROJECT.md`
so it remembers your project next time.

There's no single right order — but most people like to **make it look good
first**, then fill in their words and work. Here's a natural flow:

### 1. Make it look like you (start here — the fun part)
Give the site *your* feel before worrying about content — this is a big part of
the project, so play. See **"Refining your design"** below for how to prompt it.
> Give the whole site a warm, editorial feel — a serif for headings and lots
> of whitespace.

### 2. Add your name & words
> Replace the "REPLACE" placeholders. My name is ___, I'm studying ___, and I
> make ___. Update the home page and the footer.

### 3. Write your About Me
> Rewrite the About Me paragraph on the home page. Here are some notes about
> me: [paste a few sentences]. Keep it friendly and about 3 sentences.

### 4. Add your project(s)
The template starts with **one** project to fill in. Update it with your own
title and description. Want more than one? Just say:
> Add another project.

Claude makes a new card **and** its own page, and links them up for you.

### 5. Add your images
> Put my images `poster.jpg` and `sketch.jpg` (they're in the assets
> folder) into my project page, and use `poster.jpg` as its card image on
> the home page.

*(First, drag your image files into the `assets` folder yourself.)*

### 6. Check it works on a phone
> Show me how this looks on a narrow phone screen and fix anything that
> looks broken.

---

## Refining your design

The design is a real priority for this project, so it's worth spending real time here.

**Speak in design language.** A word like *"fun"* or *"editorial"* means
something different to everyone, so the more you describe *what it means to you*,
the closer you'll get to what you pictured. Instead of just *"make it fun"*, try
*"make it fun — bright colours, rounded corners, a bold playful heading font."*
Think in terms of **colour, type (fonts), spacing, and imagery**. If you give
Claude a vague word, it may ask you a quick question to pin it down — that's on
purpose, to help you get the result you want.

There are three ways to steer the look — **use whichever suits you** (you don't
have to use Figma at all):

**1. Describe it in words (no Figma needed).**
The colours, fonts and spacing all live as "design tokens" at the top of
`styles.css`, so a single request restyles the whole site. Be specific:
> Change the accent to a deep clay red and use a serif font for headings.

> Make it feel calmer and more editorial, with more space between sections.

**2. Design in Figma, then hand Claude an image.**
Make your layout in Figma, then **export the frame as a PNG** (or screenshot
it) and paste it into the chat:
> Build my hero to match this image.

For an exact match, read the real values off Figma's **inspect panel** (right
side — hex colours, pixel sizes) and paste them in too.

**3. Connect Figma live (optional — for a precise match).**
This uses Figma's **Dev Mode** (your student licence should cover it) to let
Claude read your design directly. It takes a little one-time setup — **your tutor
will walk through it**, and Figma has an [official guide][figma-mcp]. The gist:
> 1. Open your design in the **Figma desktop app**.
> 2. Switch to **Dev Mode**, then turn on the **MCP server** from Dev Mode's
>    right-hand panel.
> 3. In **Claude Desktop's settings**, add **Figma** as a connector so Claude can
>    reach it.
> 4. Select a frame in Figma, then ask Claude to build from it.

If the setup gives you trouble, don't worry — method 1 or 2 works just as well.

[figma-mcp]: https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server

---

## A few UX ideas to keep in mind

"UX" is how your site *feels to use*. You don't need to study it, but a few
simple ideas will make your portfolio noticeably better — and Claude will nudge
you about them as you go:

- **Hierarchy** — the most important things should look the most important.
- **Readability** — keep text easy to read (enough contrast, not tiny).
- **Whitespace** — give things room; don't cram.
- **Feedback** — buttons and links should react when you hover or tab to them, so
  the site feels alive (the template already does this — try not to remove it).
- **UX writing** — your *words* matter as much as the visuals. Say what things do
  in plain language, and keep labels short and clear.
- **Keep it simple** — a couple of fonts and a small set of colours usually looks
  better than lots.

Curious? These come from the **[Laws of UX](https://lawsofux.com)** — a friendly
collection of design principles worth a browse.

---

## Tips for working with Claude

- **Ask for one thing at a time.** Small steps are easier to check.
- **Be specific.** "Make the headings 20% bigger and bolder" beats "make it nicer".
- **Look after each change**, then refresh your browser. If you don't like
  it, just say *"undo that"* or *"go back to how it was"*.
- **Don't know the words?** Describe it plainly: *"the menu at the top",
  "the box around each project", "the space between things"*. Claude will
  figure out the code.

---

## When something goes wrong (don't panic)

First rule: **you can't really break anything.** Say *"undo that"* to step back,
or just tell Claude what happened and it'll fix it. The usual culprits:

- **My image isn't showing.** The file name must match *exactly* (including
  `.jpg` vs `.png`) and the image must be in the `assets` folder. Tell Claude
  the real file name and it'll sort the link.
- **My change didn't appear.** Two things: make sure the file is **saved**, then
  **refresh** the browser (Cmd+R). Claude saves its own edits, so usually you
  just need the refresh.
- **The page looks broken / weird.** Say *"the page looks broken after that last
  change — can you fix it?"* Undo always works too.
- **I'm lost.** Ask Claude *"what should I do next?"* — it knows your project.

### Adding images
Drag your image files into the **`assets`** folder, then ask Claude to use them.
A couple of habits:
- Use **JPG** for photos, **PNG** for graphics/logos.
- Keep them a **reasonable size** — huge photos straight off a camera make the
  page slow. If unsure, ask Claude *"is this image too big for the web?"*
- Give files **simple names** — `poster.jpg`, not `IMG_4821 final FINAL (2).jpg`.

---

## A note on accessibility

Good design works for *everyone*. This template already does the basics —
keyboard users can see where they are, motion-sensitive people get calmer
animations, and there's a "skip to content" link. Two things stay **your** job:

- **Alt text** — a short description of each image, for people who can't see it.
  Claude will ask you for these; write them honestly (*"a red screen-printed
  poster reading Open Studio"*).
- **Contrast** — if you pick your own colours, keep text easy to read against
  its background. Ask Claude *"is this text readable enough?"* and it'll check.

---

## Before you submit (checklist)

When you think you're finished, ask Claude:
> I think I'm done — find any REPLACE text or placeholders I've missed,
> including the browser tab title.

Then run through this:

- [ ] No `REPLACE` text left anywhere on the site.
- [ ] An **About Me** paragraph that is actually about you. *(required)*
- [ ] A **projects section** with at least one real project — title, image(s), and description. *(required)*
- [ ] All placeholder images swapped for your own.
- [ ] It still works when the browser window is narrow (phone size).
- [ ] Zip this whole folder as `Lastname_Firstname_Portfolio.zip` and upload to Nuku.

Good luck — make it yours.

ASSETS
======

HEADSHOTS
---------
Two files are expected:

  assets/headshot-zolomon.jpg
  assets/headshot-jad.jpg

Specs: square crop, 640x640 or larger, head and shoulders, plain or softly
blurred background. JPG or PNG both fine (update the file extension in the
img tag if you use PNG).

They appear in TWO places:
  · index.html   -> #founders section, founder cards
  · (team.html does not use headshots; add one if you want)

To swap a placeholder for a real photo, find the founder's card and replace:

  <div class="headshot headshot-ph" role="img" aria-label="..."><span>ZK</span></div>

with the img tag written out in the HTML comment directly above it:

  <img class="headshot" src="assets/headshot-zolomon.jpg" alt="Zolomon Kaliser" width="96" height="96" />

The .headshot CSS rule in assets/site.css already handles the circular crop
and sizing. Once both photos are in, the .headshot-ph rules in site.css can
be deleted.


SHARED STYLESHEET AND SCRIPT
----------------------------
  assets/site.css   every page loads this. Design tokens, nav, buttons,
                    cards, pricing, forms, footer, responsive rules.
  assets/site.js    every page loads this. Nav shrink, mobile menu, scroll
                    reveal, smooth anchors.

Page-specific CSS and JS live inline on the page that needs it
(work.html has the deliverable deck, team.html the CV layout,
intake.html the multi-step form).

Changing a color, a font, or the nav means editing ONE file now, not five.

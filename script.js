/* =============================================================
   SCRIPT.JS  —  a tiny bit of JavaScript
   =============================================================
   This file does just two small jobs. You probably don't need to
   touch it, but here's what it does so nothing feels like magic.
   ============================================================= */

/* -------------------------------------------------------------
   1. MOBILE MENU
   On small screens, tapping the hamburger button shows/hides the
   navigation links.
   ------------------------------------------------------------- */
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    // Add or remove the "open" class that makes the menu visible.
    const isOpen = links.classList.toggle("nav__links--open");
    // Tell screen readers whether the menu is open, and match the label to it.
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the menu again after tapping a link.
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("nav__links--open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

/* -------------------------------------------------------------
   3. INTRO SCREEN: SHRINK AND FADE ON SCROLL
   As the visitor scrolls, we work out how far through the first
   screen they are (0 = top, 1 = a full screen scrolled) and use
   that number to make the artwork smaller and more see-through.
   ------------------------------------------------------------- */
const intro = document.querySelector(".intro");
const introImage = document.querySelector(".intro__stage");

function updateIntro() {
  if (!intro || !introImage) return;
  // Progress from 0 to 1 over the first 80% of a screen of scrolling.
  const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
  // Slide up until it meets the top bar while shrinking to half size.
  // (The scale is anchored at the top edge, see transform-origin in styles.css.)
  const headerHeight = document.querySelector(".site-header").offsetHeight;
  const lift = Math.max(introImage.offsetTop - headerHeight, 0) * progress;
  introImage.style.transform = `translateY(${-lift}px) scale(${1 - progress * 0.5})`;
  intro.style.opacity = 1 - progress;                         // fades to nothing
  // Once fully faded, hide it so it can't block anything.
  intro.style.visibility = progress >= 1 ? "hidden" : "visible";
}

window.addEventListener("scroll", updateIntro, { passive: true });
window.addEventListener("resize", updateIntro);
updateIntro();

/* -------------------------------------------------------------
   4. SLIDING ROW OF DOORS  (slides by itself AND can be scrolled by hand)
   The row of doors is copied once so it can loop with no gap. One number,
   "pos", says how far the row has slid. Every frame we nudge it along on
   its own, and the visitor can change it too: by dragging with the mouse or
   a finger, by sideways scrolling on a trackpad (or Shift + mouse wheel), or
   with the left/right arrow keys. When pos reaches the width of one set of
   doors it wraps back to 0, and since the copy looks identical, you can't
   see the join. Ordinary up/down scrolling still scrolls the page.
   ------------------------------------------------------------- */
const doorLoop = document.querySelector(".door-loop");
const doorTrack = document.querySelector(".door-loop__track");

if (doorLoop && doorTrack) {
  // Make two extra copies of the whole row: one before and one after the real
  // doors. The row always sits with the real doors in view, and the copies fill
  // the space on either side, so there's never a gap or a door that pops out of
  // existence when the loop wraps around.
  const realDoors = [...doorTrack.children];
  const makeCopies = () => realDoors.map((door) => {
    const copy = door.cloneNode(true);
    copy.setAttribute("aria-hidden", "true"); // screen readers should only meet each door once
    copy.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1")); // and Tab should skip copies
    if (copy.matches("a")) copy.setAttribute("tabindex", "-1");
    return copy;
  });
  doorTrack.prepend(...makeCopies()); // copy of the row before the real doors
  doorTrack.append(...makeCopies());  // copy of the row after the real doors

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SECONDS_PER_LOOP = 90;    // how slowly it slides by itself
  const PAUSE_AFTER_TOUCH = 2500; // ms of stillness after the visitor uses it

  let pos = 0;             // how far the row has slid left, in pixels
  let setWidth = 1;        // width of one set of doors
  let doorStep = 1;        // distance from one door to the next
  let velocity = 0;        // extra speed from a flick or a scroll, in pixels per second
  let dragging = false;    // is a finger or mouse button down?
  let hasDragged = false;  // did it move far enough to count as a drag?
  let suppressClick = false;
  let hovering = false;
  let pausedUntil = 0;
  let dragStartX = 0;
  let dragStartPos = 0;
  let lastX = 0;
  let lastTime = 0;

  function measure() {
    const kids = doorTrack.children;
    const count = realDoors.length;
    // kids[0 .. count-1] is the copy before, kids[count .. 2*count-1] are the real doors
    setWidth = kids[count * 2].offsetLeft - kids[count].offsetLeft; // exactly one row wide
    doorStep = kids[count + 1].offsetLeft - kids[count].offsetLeft;
  }

  function apply() {
    pos = ((pos % setWidth) + setWidth) % setWidth; // wrap around
    // The extra setWidth shifts the real doors back into view (the copy before them sits off-screen to the left).
    doorTrack.style.transform = `translate3d(${-(pos + setWidth)}px, 0, 0)`;
  }

  function touched() {
    pausedUntil = performance.now() + PAUSE_AFTER_TOUCH;
  }

  // Dragging with a mouse, pen or finger. touch-action: pan-y (in the CSS)
  // lets the page keep scrolling up and down while we handle sideways.
  doorLoop.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    hasDragged = false;
    dragStartX = lastX = e.clientX;
    dragStartPos = pos;
    lastTime = e.timeStamp;
    velocity = 0;
  });

  doorLoop.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    if (!hasDragged && Math.abs(dx) > 5) {
      hasDragged = true; // far enough to count as a drag, not a click
      doorLoop.setPointerCapture(e.pointerId);
      doorLoop.classList.add("is-dragging");
    }
    if (hasDragged) {
      pos = dragStartPos - dx;
      const dt = e.timeStamp - lastTime;
      if (dt > 0) {
        // remember how fast the finger is moving, so a flick keeps going
        velocity = 0.8 * velocity + 0.2 * (-(e.clientX - lastX) / dt) * 1000;
      }
      lastX = e.clientX;
      lastTime = e.timeStamp;
      apply();
    }
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    doorLoop.classList.remove("is-dragging");
    if (hasDragged) {
      suppressClick = true; // a drag shouldn't also open the door's page
      setTimeout(() => { suppressClick = false; }, 0);
      touched();
    } else {
      velocity = 0;
    }
  }
  doorLoop.addEventListener("pointerup", endDrag);
  doorLoop.addEventListener("pointercancel", endDrag);

  doorLoop.addEventListener("click", (e) => {
    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Stops the browser starting its own "drag this image/link" ghost.
  doorLoop.addEventListener("dragstart", (e) => e.preventDefault());

  // Sideways scrolling (trackpad swipe, or Shift + mouse wheel).
  doorLoop.addEventListener("wheel", (e) => {
    const sideways = e.shiftKey ? e.deltaY : e.deltaX;
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault(); // keep the page still while the doors move
      pos += sideways;
      velocity = 0;
      apply();
      touched();
    }
  }, { passive: false });

  // Left / right arrow keys move one door at a time.
  doorLoop.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      pos += e.key === "ArrowRight" ? doorStep : -doorStep;
      apply();
      touched();
    }
  });

  // Tabbing to a door slides it into view.
  doorLoop.addEventListener("focusin", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth) {
      pos += rect.left - (window.innerWidth - rect.width) / 2;
      apply();
    }
    touched();
  });

  // Pause the automatic sliding while a mouse is over the doors.
  doorLoop.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hovering = true; });
  doorLoop.addEventListener("pointerleave", () => { hovering = false; });

  // The animation loop: runs once per screen refresh.
  let previous = performance.now();
  function frame(now) {
    const dt = Math.min(now - previous, 50) / 1000; // seconds since last frame
    previous = now;
    if (!dragging) {
      pos += velocity * dt;
      velocity *= Math.exp(-3 * dt); // a flick slows down smoothly
      const idle = !hovering && now >= pausedUntil && !reducedMotion;
      if (idle) pos += (setWidth / SECONDS_PER_LOOP) * dt; // slide by itself
    }
    apply();
    requestAnimationFrame(frame);
  }

  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  requestAnimationFrame(frame);
}

/* -------------------------------------------------------------
   5. CLICK AN IMAGE TO ENLARGE IT  (Rowan project page)
   Each gallery image becomes clickable (and focusable with the keyboard).
   Clicking opens it large on top of the page, using a <dialog>, which the
   browser handles for us: it dims the page, keeps keyboard focus inside,
   and closes when you press Esc. Click outside the picture, press Esc, or
   use the Close button to go back. Left/right arrows (or the buttons) move
   between images.
   ------------------------------------------------------------- */
const galleryImages = [...document.querySelectorAll(".page-rowan .project__gallery img:not([aria-hidden=\"true\"])")];

if (galleryImages.length) {
  const lightbox = document.createElement("dialog");
  lightbox.className = "lightbox";
  lightbox.setAttribute("aria-label", "Enlarged image");
  lightbox.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close enlarged image">&times;</button>
    <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">&#8249;</button>
    <img class="lightbox__image" alt="" />
    <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next image">&#8250;</button>
  `;
  document.body.appendChild(lightbox);

  const bigImage = lightbox.querySelector(".lightbox__image");
  let current = 0;

  function show(index) {
    current = (index + galleryImages.length) % galleryImages.length; // wraps around at the ends
    bigImage.src = galleryImages[current].src;
    bigImage.alt = galleryImages[current].alt;
  }

  function openLightbox(index) {
    show(index);
    lightbox.showModal();
    document.body.classList.add("lightbox-open"); // stops the page scrolling behind it
  }

  galleryImages.forEach((img, index) => {
    // Make each picture behave like a button: focusable, and Enter/Space opens it.
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-haspopup", "dialog");
    img.setAttribute("aria-label", "Enlarge image: " + img.alt);
    img.classList.add("zoomable");
    img.addEventListener("click", () => openLightbox(index));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightbox.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lightbox__nav--prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lightbox__nav--next").addEventListener("click", () => show(current + 1));

  // Clicking the dark area around the picture closes it.
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    galleryImages[current].focus(); // put keyboard focus back where it was
  });
}

/* -------------------------------------------------------------
   6. PAGE-TURNING ZINE VIEWER  (Ouroboros project page)
   The zine is a row of images: a single-page cover, a number of double-page
   spreads, and a single-page back cover. We build it as "leaves", sheets of
   paper with a front and a back:
     leaf 0     front = cover                  back = left page of spread 1
     leaf n     front = right page of spread n back = left page of spread n+1
     last leaf  front = right page of the last spread, back = back cover
   Turning a leaf swings it over the spine (the middle) with a CSS 3D
   rotation (see .flipbook in styles.css). "turned" counts how many leaves
   have been swung over to the left: 0 means the book is closed on its
   front cover (the cover sits on the right), and every leaf turned means
   it's closed again on the back cover (sitting on the left).
   ------------------------------------------------------------- */
const flipbook = document.querySelector(".flipbook");

if (flipbook) {
  const book = flipbook.querySelector(".flipbook__book");
  const prevButton = document.querySelector('[data-flip="prev"]');
  const nextButton = document.querySelector('[data-flip="next"]');
  const statusText = document.querySelector(".flipbook__status");
  const startButton = document.querySelector('[data-flip="start"]');
  const jumpRow = document.querySelector(".flipbook__jump");
  const jumpSelect = document.getElementById("zine-jump");

  const path = flipbook.dataset.path;
  const ext = flipbook.dataset.ext;
  const pageCount = Number(flipbook.dataset.count);   // cover + spreads + back cover
  const spreadCount = pageCount - 2;                   // the double-page spreads in between
  const leafCount = spreadCount + 1;
  const TURN_TIME = 900;                               // ms, matches the transition in styles.css

  const imageFile = (n) => `${path}${String(n).padStart(2, "0")}${ext}`; // n counts from 1

  // One face of a sheet. kind: "full" (a whole single page), "left" or "right" (half of a spread).
  function makeFace(pageNumber, kind, isBack) {
    const face = document.createElement("div");
    face.className = "flipbook__face" + (isBack ? " flipbook__face--back" : "");
    face.classList.add(kind === "full" ? "flipbook__face--full" : "flipbook__face--half");
    if (kind === "right") face.classList.add("flipbook__face--right");
    const img = document.createElement("img");
    img.src = imageFile(pageNumber);
    img.alt = ""; // the pages are described by the status line, and the PDF can be downloaded
    img.decoding = "async";
    face.appendChild(img);
    return face;
  }

  const leaves = [];
  for (let k = 0; k < leafCount; k++) {
    const leaf = document.createElement("div");
    leaf.className = "flipbook__leaf";
    // front side
    leaf.appendChild(k === 0 ? makeFace(1, "full", false) : makeFace(k + 1, "right", false));
    // back side
    leaf.appendChild(k === leafCount - 1 ? makeFace(pageCount, "full", true) : makeFace(k + 2, "left", true));
    book.appendChild(leaf);
    leaves.push(leaf);
  }

  let turned = 0;

  // Which leaf sits on top of which: on the right, the first leaf is on top; on the left, the last one turned is.
  function stack(leaf, k) {
    leaf.style.zIndex = leaf.classList.contains("flipbook__leaf--turned") ? k + 1 : leafCount - k;
  }

  function label() {
    if (turned === 0) return "Cover";
    if (turned === leafCount) return "Back cover";
    return `Pages ${turned * 2 - 1}\u2013${turned * 2}`; // spread n holds zine pages 2n-1 and 2n
  }

  function update() {
    flipbook.classList.toggle("flipbook--at-cover", turned === 0); // shows the "Click to read" box
    statusText.textContent = label();
    prevButton.disabled = turned === 0;
    nextButton.disabled = turned === leafCount;
    if (startButton) startButton.disabled = turned === 0;
  }

  function turn(k, toLeft, duration = TURN_TIME) {
    const leaf = leaves[k];
    leaf.style.transitionDuration = duration + "ms";
    // on top of everything while it's moving (and in the right order if several move at once)
    leaf.style.zIndex = leafCount + 2 + (toLeft ? k : leafCount - k);
    leaf.classList.toggle("flipbook__leaf--turned", toLeft);
    setTimeout(() => {
      stack(leaf, k);                                  // then it settles into its place in the pile
      leaf.style.transitionDuration = "";
    }, duration);
  }

  // Jump straight to a state: 0 = cover, 1 to (leafCount - 1) = a spread, leafCount = back cover.
  // Every page in between turns in quick succession, one after another.
  function goTo(target) {
    target = Math.max(0, Math.min(leafCount, target));
    if (target === turned) return;
    const duration = Math.abs(target - turned) > 1 ? 550 : TURN_TIME; // quicker for a long jump
    const gap = 45;                                                   // ms between one page and the next
    if (target > turned) {
      for (let k = turned; k < target; k++) setTimeout(() => turn(k, true, duration), (k - turned) * gap);
    } else {
      for (let k = turned - 1; k >= target; k--) setTimeout(() => turn(k, false, duration), (turned - 1 - k) * gap);
    }
    turned = target;
    update();
  }

  function next() {
    if (turned >= leafCount) return;
    turn(turned, true);
    turned++;
    update();
  }

  function prev() {
    if (turned <= 0) return;
    turned--;
    turn(turned, false);
    update();
  }

  leaves.forEach(stack);
  update();

  // ---- "Enlarge to fit screen" ----
  // Fills the window with the book and its buttons (and uses the browser's full-screen
  // mode too, where it's available). Esc, or the same button, goes back.
  const wrap = flipbook.closest(".flipbook-wrap");
  const enlargeButton = document.querySelector('[data-flip="enlarge"]');
  let enlarged = false;

  function setEnlarged(on) {
    enlarged = on;
    wrap.classList.toggle("flipbook-wrap--enlarged", on);
    document.body.classList.toggle("lightbox-open", on); // stops the page scrolling behind it
    enlargeButton.textContent = on ? "Exit enlarged view" : "Enlarge to fit screen";
    if (on) {
      wrap.setAttribute("role", "dialog");
      wrap.setAttribute("aria-modal", "true");
      wrap.setAttribute("aria-label", "Enlarged zine");
      flipbook.focus();
    } else {
      wrap.removeAttribute("role");
      wrap.removeAttribute("aria-modal");
      wrap.removeAttribute("aria-label");
      enlargeButton.focus();
    }
  }

  if (wrap && enlargeButton) {
    enlargeButton.hidden = false; // the button only appears when the script is working
    enlargeButton.addEventListener("click", () => {
      if (!enlarged) {
        setEnlarged(true);
        if (wrap.requestFullscreen) wrap.requestFullscreen().catch(() => {}); // fine if the browser says no
      } else {
        if (document.fullscreenElement) document.exitFullscreen();
        setEnlarged(false);
      }
    });

    // Leaving full-screen with Esc (the browser handles that key) should also leave the enlarged view.
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && enlarged) setEnlarged(false);
    });

    document.addEventListener("keydown", (e) => {
      if (!enlarged) return;
      if (e.key === "Escape") setEnlarged(false);
      if (e.key === "Tab") {
        // keep keyboard focus inside the enlarged view
        const items = [...wrap.querySelectorAll("button:not(:disabled), select, [tabindex='0']")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  nextButton.addEventListener("click", next);
  prevButton.addEventListener("click", prev);

  // "Back to start" and the page index.
  if (jumpRow && startButton && jumpSelect) {
    jumpRow.hidden = false; // only shown when the script is working
    startButton.addEventListener("click", () => goTo(0));
    jumpSelect.addEventListener("change", () => {
      if (jumpSelect.value !== "") goTo(Number(jumpSelect.value));
      jumpSelect.selectedIndex = 0; // back to "Choose a page..." so the same page can be chosen again later
    });
  }

  // Clicking the right-hand half goes forward, the left-hand half goes back.
  let swiped = false;
  book.addEventListener("click", (e) => {
    if (swiped) { swiped = false; return; }
    const box = book.getBoundingClientRect();
    // While the book is closed on its cover, a click anywhere opens it (the "Click to read" box is on the left).
    if (turned === 0 || e.clientX - box.left > box.width / 2) next(); else prev();
  });

  // Swiping with a finger: swipe left for next, right for previous.
  let startX = null;
  book.addEventListener("pointerdown", (e) => { startX = e.clientX; });
  book.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) {
      swiped = true; // the click that follows a swipe shouldn't also turn a page
      setTimeout(() => { swiped = false; }, 400); // (and don't let that flag linger)
      if (dx < 0) next(); else prev();
    }
  });

  flipbook.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  });
}

/* -------------------------------------------------------------
   2. AUTOMATIC YEAR IN THE FOOTER
   Fills in the current year so you never have to update it.
   ------------------------------------------------------------- */
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


/* -------------------------------------------------------------
   7. WORKBOOK VIEWER (project-6.html)
   Shows one workbook page at a time. Previous / Next / Back to
   start buttons and the left and right arrow keys change the page.
   ------------------------------------------------------------- */
(function () {
  const viewer = document.getElementById("workbook");
  if (!viewer) return;

  const img = viewer.querySelector(".workbook__page");
  const status = document.getElementById("workbook-status");
  const prev = document.getElementById("workbook-prev");
  const next = document.getElementById("workbook-next");
  const first = document.getElementById("workbook-first");
  const count = parseInt(viewer.dataset.count, 10);
  const enlarge = document.getElementById("workbook-enlarge"); // optional "Enlarge" button
  let page = 1;
  let popup = null; // the enlarged-page popup, made the first time Enlarge is clicked

  function src(n) {
    return viewer.dataset.path + String(n).padStart(2, "0") + "." + viewer.dataset.ext;
  }

  function show(n) {
    page = Math.min(count, Math.max(1, n));
    img.src = src(page);
    img.alt = "Workbook page " + page + " of " + count;
    status.textContent = "Page " + page + " of " + count;
    prev.disabled = first.disabled = page === 1;
    next.disabled = page === count;
    // If the enlarged popup is open, keep it on the same page.
    if (popup) popup.set(img.src, img.alt, page > 1, page < count);
    // Quietly load the next page so it appears straight away.
    if (page < count) new Image().src = src(page + 1);
  }

  // The Enlarge button (only on pages that have one) opens the current page large.
  if (enlarge) {
    enlarge.addEventListener("click", () => {
      if (!popup) popup = createEnlargeDialog((step) => show(page + step));
      popup.open(img.src, img.alt, page > 1, page < count, enlarge);
    });
  }

  prev.addEventListener("click", () => show(page - 1));
  next.addEventListener("click", () => show(page + 1));
  first.addEventListener("click", () => show(1));
  img.addEventListener("click", () => show(page + 1));

  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, select, textarea")) return;
    if (document.querySelector("dialog[open]")) return;
    if (e.target.closest && e.target.closest(".flipbook")) return; // arrow keys on the zine turn the zine, not the workbook
    if (e.key === "ArrowRight") show(page + 1);
    if (e.key === "ArrowLeft") show(page - 1);
  });

  show(1);
})();


/* -------------------------------------------------------------
   8. ENLARGE POPUP  (Collaborate with Nature page, project-5.html)
   A <dialog> (the browser's built-in popup, like the Rowan page uses) that shows
   one picture large on a dimmed page. Esc, the close button, or a click on the dark
   area closes it. If you give it an "onStep" function, it also shows previous / next
   buttons and responds to the left and right arrow keys (used for the workbook).
   ------------------------------------------------------------- */
function createEnlargeDialog(onStep) {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Enlarged image");
  dialog.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close enlarged image">&times;</button>
    ${onStep ? '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous page">&#8249;</button>' : ""}
    <img class="lightbox__image" alt="" />
    ${onStep ? '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next page">&#8250;</button>' : ""}
  `;
  document.body.appendChild(dialog);

  const big = dialog.querySelector(".lightbox__image");
  const prev = dialog.querySelector(".lightbox__nav--prev");
  const next = dialog.querySelector(".lightbox__nav--next");
  let opener = null; // the thing that was clicked, so focus can go back to it

  function set(src, alt, canPrev, canNext) {
    big.src = src;
    big.alt = alt;
    if (prev) prev.disabled = !canPrev;
    if (next) next.disabled = !canNext;
  }

  dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
  if (onStep) {
    prev.addEventListener("click", () => onStep(-1));
    next.addEventListener("click", () => onStep(1));
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && !prev.disabled) onStep(-1);
      if (e.key === "ArrowRight" && !next.disabled) onStep(1);
    });
  }
  // Clicking the dark area around the picture closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    if (opener) opener.focus(); // put keyboard focus back where it was
  });

  return {
    set,
    open(src, alt, canPrev, canNext, from) {
      opener = from || null;
      set(src, alt, canPrev, canNext);
      dialog.showModal();
      document.body.classList.add("lightbox-open"); // stops the page scrolling behind it
    },
  };
}

// Any picture marked with "data-enlarge" (the posters, the photo sheets...): click it, or focus it and
// press Enter or Space, to enlarge it. Every marked picture on the page gets this, not just the first.
(function () {
  const pictures = document.querySelectorAll("img[data-enlarge]");
  if (!pictures.length) return;

  let popup = null; // one shared popup, reused for whichever picture is opened
  pictures.forEach((picture) => {
    function openPicture() {
      if (!popup) popup = createEnlargeDialog();
      popup.open(picture.src, picture.alt, false, false, picture);
    }

    // Make the picture behave like a button: focusable, and Enter/Space opens it.
    picture.tabIndex = 0;
    picture.setAttribute("role", "button");
    picture.setAttribute("aria-haspopup", "dialog");
    picture.setAttribute("aria-label", "Enlarge picture: " + picture.alt);
    picture.addEventListener("click", openPicture);
    picture.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPicture();
      }
    });
  });
})();


// ===== 9. Game demo warning (Jansen Mansion page) =====
// The game stays covered, and isn't even loaded, until the visitor confirms the warnings.
(function () {
  const accept = document.getElementById("game-accept");
  const warning = document.getElementById("game-warning");
  const frame = document.getElementById("game-iframe");
  const box = document.getElementById("game");
  if (!accept || !warning || !frame || !box) return;

  // Shrink the game (drawn at 1440 x 1024) so the whole screen fits the box on any width.
  const DESIGN_WIDTH = 1440;
  function fit() {
    box.classList.add("is-scaled");
    frame.style.transform = "scale(" + box.clientWidth / DESIGN_WIDTH + ")";
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(box);
  else window.addEventListener("resize", fit);

  accept.addEventListener("click", () => {
    frame.src = frame.dataset.src;
    warning.hidden = true;
    frame.focus();
  });
})();

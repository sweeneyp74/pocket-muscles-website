(() => {
  const spotA = document.querySelector(".wash-spot-a");
  const spotB = document.querySelector(".wash-spot-b");
  if (!spotA || !spotB) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Same palette pairs as AmbientColorWash.lightPalette / darkPalette
  const lightPairs = [
    ["rgb(82, 199, 140)", "rgb(158, 97, 255)"],
    ["rgb(51, 184, 224)", "rgb(255, 115, 140)"],
    ["rgb(255, 158, 71)", "rgb(89, 140, 255)"],
    ["rgb(242, 89, 140)", "rgb(64, 209, 179)"],
    ["rgb(140, 107, 255)", "rgb(242, 199, 64)"],
  ];
  const darkPairs = [
    ["rgb(56, 148, 107)", "rgb(140, 89, 242)"],
    ["rgb(38, 140, 179)", "rgb(230, 89, 122)"],
    ["rgb(217, 128, 56)", "rgb(77, 115, 230)"],
    ["rgb(204, 71, 122)", "rgb(46, 166, 140)"],
    ["rgb(122, 89, 230)", "rgb(204, 166, 51)"],
  ];

  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let paletteIndex = 0;

  const applyPalette = () => {
    const pairs = darkQuery.matches ? darkPairs : lightPairs;
    const [a, b] = pairs[paletteIndex % pairs.length];
    document.documentElement.style.setProperty("--wash-a", a);
    document.documentElement.style.setProperty("--wash-b", b);
  };

  applyPalette();
  darkQuery.addEventListener?.("change", applyPalette);

  // Gently rotate palette every 18s like the app's shifting wash
  setInterval(() => {
    paletteIndex = (paletteIndex + 1) % lightPairs.length;
    applyPalette();
  }, 18000);

  let frame = 0;
  const tick = (now) => {
    // ~20fps like TimelineView minimumInterval 1/20
    if (frame && now - frame < 50) {
      requestAnimationFrame(tick);
      return;
    }
    frame = now;

    const t = now / 1000;
    const a1 = t / 14;
    const a2 = t / 18;
    const x1 = Math.sin(a1) * 140;
    const y1 = Math.cos(a1 * 0.9) * 70 + 220;
    const x2 = Math.cos(a2 + 1.2) * 150;
    const y2 = Math.sin(a2 * 1.05 + 0.4) * 80 + 260;

    spotA.style.transform = `translate3d(${x1}px, ${y1}px, 0)`;
    spotB.style.transform = `translate3d(${x2}px, ${y2}px, 0)`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
})();

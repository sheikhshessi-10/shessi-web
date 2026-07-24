# DEPLOY RULE — public/lgs (shessi.dev/lgs)

**The ONLY valid build source is `D:/lgs-redesign` (branch `feature/redesign-modernist`).**

Two sessions have now clobbered the live Modernist redesign by building from the
retired lineages (2026-07-24, twice). Before ANY push that touches public/lgs:

1. Build in D:/lgs-redesign/PortalPro (`node node_modules/typescript/bin/tsc --noEmit --incremental false  # npx tsc can resolve a decoy stub that exits 0 — never trust it` then `npm run build`).
2. Verify the bundle is the redesign: `grep -c "select-modernist" public/lgs/assets/index-*.js` must be >= 1.
3. If you are working in ANY other tree (D:/lgs-dc, the main working tree, a copy), STOP —
   port your change to D:/lgs-redesign first. D:/lgs-dc (deploy-candidate) is RETIRED.

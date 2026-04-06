/**
 * Phase 1 Reconnaissance — igloo.inc
 * Captures full-page screenshots, extracts fonts/colors/assets,
 * maps page topology, and documents all interactive behaviors.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REFS = path.join(ROOT, 'docs/design-references');
const RESEARCH = path.join(ROOT, 'docs/research');

const TARGET = 'https://www.igloo.inc/';

// CSS properties to extract
const CSS_PROPS = [
  'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
  'textTransform','textDecoration','backgroundColor','background',
  'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
  'margin','marginTop','marginRight','marginBottom','marginLeft',
  'width','height','maxWidth','minWidth','maxHeight','minHeight',
  'display','flexDirection','justifyContent','alignItems','gap',
  'gridTemplateColumns','gridTemplateRows',
  'borderRadius','border','borderTop','borderBottom','borderLeft','borderRight',
  'boxShadow','overflow','overflowX','overflowY',
  'position','top','right','bottom','left','zIndex',
  'opacity','transform','transition','cursor',
  'objectFit','objectPosition','mixBlendMode','filter','backdropFilter',
  'whiteSpace','textOverflow','WebkitLineClamp','animationName','animationDuration'
];

function log(msg) { console.log(`[recon] ${msg}`); }

async function extractStyles(page, selector) {
  return page.evaluate(({ sel, props }) => {
    const el = document.querySelector(sel);
    if (!el) return { error: `Not found: ${sel}` };
    function getStyles(element) {
      const cs = getComputedStyle(element);
      const styles = {};
      props.forEach(p => {
        const v = cs[p];
        if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') {
          styles[p] = v;
        }
      });
      return styles;
    }
    function walk(element, depth) {
      if (depth > 4) return null;
      const children = [...element.children];
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        classes: element.className?.toString().split(' ').filter(Boolean).slice(0, 8).join(' '),
        text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
          ? element.textContent.trim().slice(0, 300) : null,
        styles: getStyles(element),
        images: element.tagName === 'IMG' ? {
          src: element.src, alt: element.alt,
          naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight
        } : null,
        childCount: children.length,
        children: children.slice(0, 20).map(c => walk(c, depth + 1)).filter(Boolean)
      };
    }
    return walk(el, 0);
  }, { sel: selector, props: CSS_PROPS });
}

async function main() {
  log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });

  // ─── DESKTOP 1440px ────────────────────────────────────────────────────────
  log('Opening desktop viewport (1440px)...');
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();

  await desktopPage.goto(TARGET, { waitUntil: 'networkidle', timeout: 60000 });
  await desktopPage.waitForTimeout(3000); // let animations settle

  log('Taking desktop full-page screenshot...');
  await desktopPage.screenshot({
    path: path.join(REFS, 'igloo-desktop-1440.png'),
    fullPage: true
  });

  // ─── GLOBAL EXTRACTION ─────────────────────────────────────────────────────
  log('Extracting global tokens (fonts, colors, assets)...');
  const globals = await desktopPage.evaluate((props) => {
    // Fonts
    const fontSet = new Set();
    document.querySelectorAll('*').forEach(el => {
      const ff = getComputedStyle(el).fontFamily;
      if (ff) fontSet.add(ff);
    });

    // Color palette from key elements
    const colorSet = new Set();
    ['body','h1','h2','h3','p','a','button','nav','header','footer',
     '[class*="hero"]','[class*="nav"]','[class*="btn"]'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const cs = getComputedStyle(el);
        ['color','backgroundColor','background','borderColor'].forEach(p => {
          const v = cs[p];
          if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') colorSet.add(v);
        });
      });
    });

    // Link tags (fonts, stylesheets)
    const links = [...document.querySelectorAll('link')].map(l => ({
      rel: l.rel, href: l.href, as: l.as
    }));

    // Script tags
    const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src);

    // Images
    const images = [...document.querySelectorAll('img')].map(img => ({
      src: img.src || img.currentSrc,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight,
      parentClasses: img.parentElement?.className?.toString().slice(0, 100),
      siblings: img.parentElement ? [...img.parentElement.querySelectorAll('img')].length : 0,
      position: getComputedStyle(img).position,
      zIndex: getComputedStyle(img).zIndex
    }));

    // Videos
    const videos = [...document.querySelectorAll('video')].map(v => ({
      src: v.src || v.querySelector('source')?.src,
      poster: v.poster,
      autoplay: v.autoplay,
      loop: v.loop,
      muted: v.muted,
      width: v.videoWidth,
      height: v.videoHeight
    }));

    // Background images
    const bgImages = [];
    [...document.querySelectorAll('*')].slice(0, 500).forEach(el => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') {
        bgImages.push({
          url: bg,
          element: el.tagName + (el.id ? '#'+el.id : '') + '.' + (el.className?.toString().split(' ')[0] || '')
        });
      }
    });

    // SVG count
    const svgCount = document.querySelectorAll('svg').length;

    // Favicons
    const favicons = [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({
      href: l.href, sizes: l.sizes?.toString(), rel: l.rel
    }));

    // Check for smooth scroll libraries
    const hasLenis = !!document.querySelector('.lenis') || !!document.querySelector('[data-lenis]');
    const hasLocomotive = !!document.querySelector('.locomotive-scroll') || !!document.querySelector('[data-scroll-container]');
    const scrollLibraries = { lenis: hasLenis, locomotive: hasLocomotive };

    // Meta tags
    const meta = {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
    };

    // Body computed styles
    const bodyStyles = {};
    const bodyCs = getComputedStyle(document.body);
    props.forEach(p => {
      const v = bodyCs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto') bodyStyles[p] = v;
    });

    // Root CSS variables
    const rootStyles = {};
    try {
      const rootEl = document.documentElement;
      const rootCs = getComputedStyle(rootEl);
      // Get all CSS custom properties
      const allProps = [...rootCs].filter(p => p.startsWith('--'));
      allProps.forEach(p => { rootStyles[p] = rootCs.getPropertyValue(p).trim(); });
    } catch(e) {}

    // Page structure — top-level sections
    const sections = [...document.querySelectorAll('section, [class*="section"], main > *, body > div > *')]
      .slice(0, 30)
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: el.className?.toString().split(' ').filter(Boolean).slice(0, 6).join(' '),
        approxHeight: el.getBoundingClientRect().height,
        approxTop: el.getBoundingClientRect().top + window.scrollY,
        childCount: el.children.length,
        hasVideo: !!el.querySelector('video'),
        hasCanvas: !!el.querySelector('canvas'),
        hasIframe: !!el.querySelector('iframe'),
      }));

    return {
      fonts: [...fontSet].slice(0, 30),
      colors: [...colorSet].slice(0, 50),
      links,
      scripts: scripts.slice(0, 20),
      images: images.slice(0, 50),
      videos,
      bgImages: bgImages.slice(0, 30),
      svgCount,
      favicons,
      scrollLibraries,
      meta,
      bodyStyles,
      rootCSSVars: rootStyles,
      sections,
      pageHeight: document.documentElement.scrollHeight,
      pageWidth: document.documentElement.scrollWidth
    };
  }, CSS_PROPS);

  fs.writeFileSync(path.join(RESEARCH, 'globals.json'), JSON.stringify(globals, null, 2));
  log(`Page height: ${globals.pageHeight}px, sections found: ${globals.sections.length}`);
  log(`Images: ${globals.images.length}, Videos: ${globals.videos.length}, SVGs: ${globals.svgCount}`);
  log(`Scroll libs: Lenis=${globals.scrollLibraries.lenis}, Locomotive=${globals.scrollLibraries.locomotive}`);

  // ─── SCROLL SWEEP — capture sections ────────────────────────────────────────
  log('Scroll sweep — capturing viewport at each section...');
  const scrollPositions = [];
  const pageHeight = globals.pageHeight;
  const steps = Math.ceil(pageHeight / 800);

  for (let i = 0; i <= steps; i++) {
    const scrollY = Math.min(i * 800, pageHeight - 900);
    await desktopPage.evaluate(y => window.scrollTo(0, y), scrollY);
    await desktopPage.waitForTimeout(500);
    const screenshotPath = path.join(REFS, `scroll-desktop-${String(i).padStart(3,'0')}-y${scrollY}.png`);
    await desktopPage.screenshot({ path: screenshotPath });
    scrollPositions.push({ index: i, scrollY, screenshot: path.basename(screenshotPath) });
  }
  log(`Captured ${scrollPositions.length} scroll positions at desktop`);

  // Scroll back to top
  await desktopPage.evaluate(() => window.scrollTo(0, 0));
  await desktopPage.waitForTimeout(1000);

  // ─── HEADER SCROLL STATE ────────────────────────────────────────────────────
  log('Capturing header at scroll=0 and scroll=200...');
  const headerSelectors = ['header', 'nav', '[class*="header"]', '[class*="nav"]'];
  let headerSelector = null;
  for (const sel of headerSelectors) {
    const exists = await desktopPage.$(sel);
    if (exists) { headerSelector = sel; break; }
  }

  let headerState = {};
  if (headerSelector) {
    const headerBefore = await extractStyles(desktopPage, headerSelector);
    await desktopPage.evaluate(() => window.scrollTo(0, 200));
    await desktopPage.waitForTimeout(600);
    const headerAfter = await extractStyles(desktopPage, headerSelector);
    headerState = { selector: headerSelector, before: headerBefore, after: headerAfter };
    await desktopPage.evaluate(() => window.scrollTo(0, 0));
    await desktopPage.waitForTimeout(500);
  }
  fs.writeFileSync(path.join(RESEARCH, 'header-states.json'), JSON.stringify(headerState, null, 2));

  // ─── DETAILED DOM EXTRACTION ─────────────────────────────────────────────────
  log('Extracting full DOM structure...');
  const domStructure = await desktopPage.evaluate(() => {
    function walk(el, depth) {
      if (depth > 6) return { tag: el.tagName?.toLowerCase(), truncated: true };
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName?.toLowerCase(),
        id: el.id || null,
        classes: el.className?.toString().split(' ').filter(Boolean).join(' '),
        text: el.childElementCount === 0 ? el.textContent?.trim().slice(0, 200) : null,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        rect: { top: Math.round(rect.top + window.scrollY), height: Math.round(rect.height), width: Math.round(rect.width) },
        display: cs.display,
        position: cs.position,
        zIndex: cs.zIndex,
        overflow: cs.overflow,
        hasVideo: !!el.querySelector?.('video'),
        hasCanvas: !!el.querySelector?.('canvas'),
        childCount: el.children?.length || 0,
        children: depth < 4 ? [...(el.children || [])].slice(0, 15).map(c => walk(c, depth + 1)) : []
      };
    }
    return walk(document.body, 0);
  });

  // Write a summary (full DOM can be huge)
  const domSummary = {
    tag: domStructure.tag,
    childCount: domStructure.childCount,
    children: domStructure.children?.map(c => ({
      tag: c.tag, id: c.id, classes: c.classes?.slice(0,100),
      rect: c.rect, display: c.display, position: c.position,
      hasVideo: c.hasVideo, hasCanvas: c.hasCanvas,
      childCount: c.childCount,
      children: c.children?.map(cc => ({
        tag: cc.tag, id: cc.id, classes: cc.classes?.slice(0,80),
        rect: cc.rect, display: cc.display, childCount: cc.childCount,
        text: cc.text?.slice(0,100)
      }))
    }))
  };
  fs.writeFileSync(path.join(RESEARCH, 'dom-structure.json'), JSON.stringify(domSummary, null, 2));

  // ─── INTERACTIVE ELEMENTS ───────────────────────────────────────────────────
  log('Finding all interactive elements...');
  const interactives = await desktopPage.evaluate(() => {
    const sels = ['button', 'a', '[role="button"]', '[onclick]', '[class*="btn"]',
                  '[class*="tab"]', '[class*="pill"]', 'input', 'select'];
    const found = [];
    sels.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const rect = el.getBoundingClientRect();
        found.push({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().slice(0, 100),
          href: el.href || null,
          classes: el.className?.toString().split(' ').filter(Boolean).slice(0,5).join(' '),
          rect: { top: Math.round(rect.top + window.scrollY), left: Math.round(rect.left) }
        });
      });
    });
    return found.slice(0, 60);
  });
  fs.writeFileSync(path.join(RESEARCH, 'interactives.json'), JSON.stringify(interactives, null, 2));
  log(`Found ${interactives.length} interactive elements`);

  await desktopCtx.close();

  // ─── MOBILE 390px ──────────────────────────────────────────────────────────
  log('Opening mobile viewport (390px)...');
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(TARGET, { waitUntil: 'networkidle', timeout: 60000 });
  await mobilePage.waitForTimeout(3000);

  log('Taking mobile full-page screenshot...');
  await mobilePage.screenshot({
    path: path.join(REFS, 'igloo-mobile-390.png'),
    fullPage: true
  });

  // Mobile DOM structure quick capture
  const mobileSections = await mobilePage.evaluate(() => {
    return [...document.querySelectorAll('section, main > *, body > div > *')]
      .slice(0, 20)
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        classes: el.className?.toString().split(' ').filter(Boolean).slice(0,4).join(' '),
        height: Math.round(el.getBoundingClientRect().height),
        display: getComputedStyle(el).display
      }));
  });
  fs.writeFileSync(path.join(RESEARCH, 'mobile-sections.json'), JSON.stringify(mobileSections, null, 2));

  await mobileCtx.close();

  // ─── TABLET 768px ──────────────────────────────────────────────────────────
  log('Opening tablet viewport (768px)...');
  const tabletCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tabletPage = await tabletCtx.newPage();
  await tabletPage.goto(TARGET, { waitUntil: 'networkidle', timeout: 60000 });
  await tabletPage.waitForTimeout(2000);
  await tabletPage.screenshot({
    path: path.join(REFS, 'igloo-tablet-768.png'),
    fullPage: true
  });
  await tabletCtx.close();

  await browser.close();

  // ─── WRITE SUMMARY REPORT ──────────────────────────────────────────────────
  const report = {
    target: TARGET,
    timestamp: new Date().toISOString(),
    screenshots: {
      desktop: 'docs/design-references/igloo-desktop-1440.png',
      mobile: 'docs/design-references/igloo-mobile-390.png',
      tablet: 'docs/design-references/igloo-tablet-768.png',
      scrollCaptures: scrollPositions.length
    },
    fonts: globals.fonts.slice(0, 10),
    rootCSSVars: Object.keys(globals.rootCSSVars).length,
    imageCount: globals.images.length,
    videoCount: globals.videos.length,
    svgCount: globals.svgCount,
    bgImageCount: globals.bgImages.length,
    sectionCount: globals.sections.length,
    scrollLibraries: globals.scrollLibraries,
    pageHeight: globals.pageHeight,
    meta: globals.meta,
    headerHasScrollState: !!(headerState.before && headerState.after),
    interactiveCount: interactives.length
  };

  fs.writeFileSync(path.join(RESEARCH, 'recon-summary.json'), JSON.stringify(report, null, 2));
  log('Recon complete! Summary:');
  console.log(JSON.stringify(report, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });

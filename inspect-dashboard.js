const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  console.log('=== LOGIN AND NAVIGATE ===');
  await page.goto('http://localhost:3000/fr/login', { timeout: 30000 });
  await page.waitForSelector('[aria-label="Fake auth debug panel"]', { timeout: 10000 });
  await page.locator('button', { hasText: 'Log in as Coach' }).click();
  await page.waitForTimeout(500);
  await page.evaluate(async () => {
    if (window.next?.router) await window.next.router.push('/dashboard/coach');
  });
  await page.waitForTimeout(5000);
  
  console.log('Dashboard loaded');
  
  console.log('=== 1. ALL FIXED-POSITIONED ELEMENTS ===');
  const fixedElements = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const fixed = [];
    for (const el of all) {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed') {
        const rect = el.getBoundingClientRect();
        fixed.push({
          tag: el.tagName,
          className: el.className,
          text: el.textContent?.trim().substring(0, 100),
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), bottom: Math.round(rect.bottom), right: Math.round(rect.right) },
          styles: { position: style.position, zIndex: style.zIndex, top: style.top, left: style.left, bottom: style.bottom, right: style.right, overflow: style.overflow, transform: style.transform }
        });
      }
    }
    return fixed;
  });
  console.log(JSON.stringify(fixedElements, null, 2));
  
  console.log('=== 2. SIDEBAR FOOTER EXACT BOUNDING BOX ===');
  const sidebarFooter = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return { found: false };
    const footerDivs = aside.querySelectorAll('div');
    for (const div of footerDivs) {
      const style = window.getComputedStyle(div);
      if (style.borderTopWidth !== '0px' || div.className.includes('border-t')) {
        const rect = div.getBoundingClientRect();
        return { found: true, className: div.className, rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), bottom: Math.round(rect.bottom), right: Math.round(rect.right) }, html: div.outerHTML.substring(0, 500) };
      }
    }
    const lastDiv = footerDivs[footerDivs.length - 1];
    if (lastDiv) {
      const rect = lastDiv.getBoundingClientRect();
      return { found: true, selector: 'aside > div:last-child', className: lastDiv.className, rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), bottom: Math.round(rect.bottom), right: Math.round(rect.right) }, html: lastDiv.outerHTML.substring(0, 500) };
    }
    return { found: false };
  });
  console.log(JSON.stringify(sidebarFooter, null, 2));
  
  console.log('=== 3. BOTTOM-LEFT OVERLAPPING ELEMENTS ===');
  const overlapping = await page.evaluate(() => {
    const vh = window.innerHeight;
    const all = document.querySelectorAll('*');
    const found = [];
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.x < 256 && rect.bottom > vh - 100 && rect.width > 0 && rect.height > 0) {
        const style = window.getComputedStyle(el);
        found.push({ tag: el.tagName, className: el.className, text: el.textContent?.trim().substring(0, 80), rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), bottom: Math.round(rect.bottom) }, styles: { position: style.position, zIndex: style.zIndex } });
      }
    }
    return found;
  });
  console.log(JSON.stringify(overlapping, null, 2));
  
  console.log('=== 4. N AVATAR DETAILED INSPECTION ===');
  const nAvatar = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const text = el.textContent?.trim();
      if (text === 'N') {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const parent = el.parentElement;
        const grandparent = parent?.parentElement;
        return { tag: el.tagName, className: el.className, text: text, rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), bottom: Math.round(rect.bottom) }, styles: { position: style.position, zIndex: style.zIndex }, parent: { tag: parent?.tagName, className: parent?.className }, grandparent: { tag: grandparent?.tagName, className: grandparent?.className }, outerHTML: el.outerHTML, parentHTML: parent?.outerHTML.substring(0, 500), grandparentHTML: grandparent?.outerHTML.substring(0, 800) };
      }
    }
    return { found: false };
  });
  console.log(JSON.stringify(nAvatar, null, 2));
  
  console.log('=== 5. PENDING REQUESTS SECTION ===');
  const pendingRequests = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const found = [];
    for (const el of all) {
      const text = el.textContent || '';
      if (text.includes('Demande') || text.includes('Nicolas') || text.includes('brasse')) {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.width > 200) {
          found.push({ tag: el.tagName, className: el.className, text: text.trim().substring(0, 200), rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }, styles: { overflow: style.overflow, overflowX: style.overflowX, overflowY: style.overflowY, transform: style.transform } });
        }
      }
    }
    return found;
  });
  console.log(JSON.stringify(pendingRequests, null, 2));
  
  console.log('=== 6. PENDING REQUEST CARDS OVERFLOW/TRANSFORM ===');
  const cardStyles = await page.evaluate(() => {
    const all = document.querySelectorAll('[class*="flex-col"][class*="gap-3"]');
    const found = [];
    for (const el of all) {
      const children = Array.from(el.children);
      for (const child of children) {
        const text = child.textContent || '';
        if (text.includes('Nicolas') || text.includes('Camille')) {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          found.push({ containerClass: el.className, containerRect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }, overflow: style.overflow, overflowX: style.overflowX, overflowY: style.overflowY, transform: style.transform });
        }
      }
    }
    return found;
  });
  console.log(JSON.stringify(cardStyles, null, 2));
  
  console.log('=== 7. FULL BOTTOM-LEFT HTML STRUCTURE ===');
  const bottomLeftHTML = await page.evaluate(() => {
    const vh = window.innerHeight;
    const all = document.querySelectorAll('*');
    const found = [];
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.x < 300 && rect.bottom > vh - 150 && rect.width > 5 && rect.height > 5) {
        found.push({ tag: el.tagName, className: el.className, text: el.textContent?.trim().substring(0, 50), rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), bottom: Math.round(rect.bottom) } });
      }
    }
    return found;
  });
  console.log(JSON.stringify(bottomLeftHTML, null, 2));
  
  await browser.close();
  console.log('=== INSPECTION COMPLETE ===');
})().catch(console.error);
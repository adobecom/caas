import { chromium } from 'playwright';
const CDP='http://127.0.0.1:9222';
const URL='http://localhost:8899/index.html';
const browser=await chromium.connectOverCDP(CDP);
const context=browser.contexts()[0]||await browser.newContext();

async function check(label, setup){
  const page=await context.newPage();
  await setup(page);
  await page.goto(URL,{waitUntil:'domcontentloaded',timeout:20000}).catch(()=>{});
  await page.waitForSelector('.consonant-Card',{timeout:12000}).catch(()=>{});
  await page.waitForTimeout(1500);
  const r=await page.evaluate(()=>({
    innerWidth: window.innerWidth,
    mobileSearch: document.querySelectorAll('.consonant-FiltersInfo-search').length,
  }));
  console.log(`${label}: innerWidth=${r.innerWidth}  mobileSearchWrapper=${r.mobileSearch}`);
  await page.close();
}

// A) plain setViewportSize to phone width
await check('A setViewportSize(390)', async (page)=>{ await page.setViewportSize({width:390,height:844}); });

// B) CDP Emulation.setDeviceMetricsOverride before load
await check('B Emulation.setDeviceMetricsOverride(390)', async (page)=>{
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
});

// C) desktop control
await check('C desktop(1280)', async (page)=>{ await page.setViewportSize({width:1280,height:1800}); });
await browser.close();

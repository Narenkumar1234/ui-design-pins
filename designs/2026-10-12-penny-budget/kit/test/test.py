import asyncio, json, datetime
from playwright.async_api import async_playwright
BASE='http://localhost:8766/'; OUT='/workspace/products/_test_penny/'
results=[]; errors=[]
def check(name, cond, detail=''):
    results.append((name, bool(cond), str(detail))); print(('PASS' if cond else 'FAIL'), name, detail, flush=True)
FIX=datetime.datetime(2026,10,12,10,0,0)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2)
        page = await ctx.new_page()
        await page.clock.set_fixed_time(FIX)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append('console:'+m.text) if m.type=='error' else None)
        await page.goto(BASE+'index.html'); await page.evaluate("localStorage.clear(); localStorage.setItem('penny.theme','light')")
        await page.reload(); await page.wait_for_selector('#recent li')
        g=lambda s: page.inner_text(s)
        check('balance ₹42,860', await g('#balance')=='₹42,860', await g('#balance'))
        check('income ₹65,000', await g('#income')=='₹65,000', await g('#income'))
        check('spent ₹22,140', await g('#spent')=='₹22,140', await g('#spent'))
        check('budget note', '₹7,860 left · 19 days to go' in await g('#b-note'), await g('#b-note'))
        w=await page.get_attribute('#b-bar','style'); check('budget bar 73.8%', '73.8%' in w, w)
        n=await page.locator('#recent li').count(); check('recent shows 5', n==5, n)
        await page.click('#see-all'); n=await page.locator('#recent li').count(); check('see all shows 17', n==17, n)
        await page.click('#see-all')
        # month nav
        await page.click('#prev-month'); check('prev month -> September', 'September' in await g('#month-label'))
        check('Sep spent ₹25,160', await g('#spent')=='₹25,160', await g('#spent'))
        check('next enabled on past month', await page.is_disabled('#next-month')==False)
        await page.click('#next-month'); check('back to October', 'October' in await g('#month-label')); check('next disabled', await page.is_disabled('#next-month'))
        # budget edit
        await page.click('#edit-budget'); await page.fill('#budget-input','20000'); await page.click('#budget-form button[value=save]'); await page.wait_for_timeout(200)
        check('budget edit -> over budget note', 'over budget' in await g('#b-note'), await g('#b-note'))
        check('track turns terracotta when over', 'over' in (await page.get_attribute('#b-track','class')))
        check('budget saved', await page.evaluate("localStorage.getItem('penny.budget')")=='20000')
        await page.click('#edit-budget'); await page.fill('#budget-input','30000'); await page.click('#budget-form button[value=save]'); await page.wait_for_timeout(200)
        # theme
        await page.click('[data-theme-toggle]'); check('theme -> dark saved', await page.evaluate("document.documentElement.classList.contains('dark') && localStorage.getItem('penny.theme')")=='dark')
        await page.reload(); await page.wait_for_selector('#recent li'); check('dark persists', await page.evaluate("document.documentElement.classList.contains('dark')"))
        await page.click('[data-theme-toggle]')
        # add expense
        await page.goto(BASE+'add.html'); await page.wait_for_selector('#keypad button')
        await page.click('#save'); check('empty amount rejected', 'Enter an amount' in await g('#err'))
        for k in ['4','5','0','.','5','0','0']: await page.click(f'[data-key="{k}"]')
        check('keypad max 2 decimals -> 450.50', await g('#amount')=='450.50', await g('#amount'))
        await page.click('[data-key="back"]'); await page.click('[data-key="back"]'); await page.click('[data-key="back"]')
        check('backspace -> 450', await g('#amount')=='450', await g('#amount'))
        await page.click('[data-cat="Health"]'); await page.fill('#note','Pharmacy')
        await page.click('#save'); await page.wait_for_url('**/index.html*'); await page.wait_for_selector('#recent li')
        check('spent updates to ₹22,590', await g('#spent')=='₹22,590', await g('#spent'))
        first=await page.inner_text('#recent li:first-child'); check('new tx at top', 'Pharmacy' in first and 'Health' in first, first.replace('\n',' | '))
        # income
        await page.goto(BASE+'add.html?type=income'); await page.wait_for_selector('#keypad button')
        check('income mode chips', await page.locator('[data-cat="Salary"]').count()==1 and await g('#save')=='Save income')
        await page.keyboard.type('1000'); await page.click('[data-cat="Gift"]'); await page.click('#save'); await page.wait_for_url('**/index.html*'); await page.wait_for_selector('#recent li')
        check('physical keyboard + income -> ₹66,000', await g('#income')=='₹66,000', await g('#income'))
        # delete
        await page.click('#recent li:first-child'); await page.click('#tx-dialog button[value=delete]'); await page.wait_for_timeout(200)
        check('delete income', await g('#income')=='₹65,000', await g('#income'))
        await page.locator('#recent li', has_text='Pharmacy').click(); await page.click('#tx-dialog button[value=delete]'); await page.wait_for_timeout(200)
        check('delete expense -> ₹22,140', await g('#spent')=='₹22,140', await g('#spent'))
        await page.reload(); await page.wait_for_selector('#recent li'); check('persists after reload', await g('#spent')=='₹22,140')
        # insights
        await page.goto(BASE+'insights.html'); await page.wait_for_selector('#cats li')
        check('insights month ₹22,140', await g('#total')=='₹22,140', await g('#total'))
        check('12% less than September', '12% less than September' in await g('#compare'), await g('#compare'))
        cats=[await page.locator('#cats li').nth(i).get_attribute('data-cat') for i in range(await page.locator('#cats li').count())]
        check('category order', cats==['Food','Bills','Shopping','Transport','Fun'], cats)
        check('Food 34%', '34%' in await page.inner_text('#cats li:first-child'))
        check('6 month bars', await page.locator('#bars .b').count()==6)
        await page.click('[data-range="week"]'); check('week 7 bars', await page.locator('#bars .b').count()==7); check('week label', 'last 7 days' in await g('#total-label'))
        await page.click('[data-range="year"]'); check('year 12 bars', await page.locator('#bars .b').count()==12)
        check('year total = 6 months', await g('#total')=='₹1,49,750', await g('#total'))
        # screenshots
        for vp,(w,h) in {'mobile':(390,844),'desktop':(1280,860)}.items():
            await page.set_viewport_size({'width':w,'height':h})
            for mode in ('light','dark'):
                for name,url in (('home','index.html'),('add','add.html'),('insights','insights.html')):
                    await page.goto(BASE+url); await page.evaluate(f"localStorage.setItem('penny.theme','{mode}')")
                    await page.reload(); await page.wait_for_timeout(900)
                    if name=='add':
                        for k in '320': await page.click(f'[data-key="{k}"]')
                        await page.fill('#note','Coffee with Riya'); await page.locator('#note').blur()
                    await page.screenshot(path=f'{OUT}{vp}-{mode}-{name}.png')
                    if vp=='mobile': await page.screenshot(path=f'{OUT}full-{mode}-{name}.png', full_page=True)
        # file:// fallback
        p2=await ctx.new_page(); await p2.clock.set_fixed_time(FIX)
        await p2.goto('file:///workspace/products/penny-budget-ui-kit/code/index.html'); await p2.wait_for_timeout(1500)
        check('file:// fallback renders', await p2.locator('#recent li').count()==5)
        await b.close()
    errs=[e for e in errors if 'cdn.tailwindcss.com should not be used in production' not in e]
    print('JS errors:', errs)
    json.dump({'results':results,'errors':errs}, open(OUT+'results.json','w'), indent=1)
    print(f"{sum(r[1] for r in results)}/{len(results)} passed")
asyncio.run(main())

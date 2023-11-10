import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import type {PreviewServer} from 'vite'
import {preview} from 'vite'
import type {Browser, ElementHandle, Page} from 'puppeteer'
import {launch} from 'puppeteer'

const PORT = 3000
describe('basic', async () => {
    let server: PreviewServer
    let browser: Browser
    let page: Page

    beforeAll(async () => {
        server = await preview({
            preview: {
                port: PORT,
                // open: true
            },
            build: {
                outDir: 'build'
            },
            configFile: false,
        })
        browser = await launch({headless: true})
        page = await browser.newPage()
        await page.goto(`http://localhost:${PORT}`, {waitUntil: 'networkidle0'})
    })

    afterAll(async () => {
        await browser.close()
        await new Promise<void>((resolve, reject) => {
            server.httpServer.close(error => error ? reject(error) : resolve())
        })
    })

    const getByText = ($container: ElementHandle<Element>, text: string) => {
        return $container.$$(`xpath///*[contains(text(), '${text}')]`)
    }

    const runTest = async (testName: string, elements: string[]) => {
        const $container = await page.$(`[data-test="${testName}"]`);
        for (const text of elements) {
            const [$el] = await getByText($container, text);
            const styleProperties = await page.evaluate(el => {
                const cssObj = getComputedStyle(el);
                const getProperties = (cssObj, properties) => {
                    return properties.reduce((acc, curr) => {
                        acc[curr] = cssObj.getPropertyValue(curr);
                        return acc;
                    }, {});
                };
                return getProperties(cssObj, ['font-size', 'font-family', 'line-height', 'font-weight', 'letter-spacing']);
            }, $el);
            expect(styleProperties).toMatchSnapshot();
        }
    };

    describe('basic', async () => {

        test('hero', async () => {
            await runTest('hero', ['Омск', '8-800-555-55-55', 'Тренажёрный зал', 'Купить абонемент']);
        });

        test('about', async () => {
            await runTest('about', ['Тренажерный зал', 'Просторный зал', 'самый большой фитнес центр']);
        });
        test('price', async () => {
            await runTest('price', ['Абонементы', '1 месяц', '6 месяцев', 'С тренером', '12 занятий', 'Купить абонемент', 'Дневной', 'с 8:00 до 17:00', '']);
        });
    });
})

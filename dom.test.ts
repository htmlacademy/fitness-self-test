import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import type {PreviewServer} from 'vite'
import {preview} from 'vite'
import type {Browser, ElementHandle, Page} from 'puppeteer'
import {launch} from 'puppeteer'

const PORT = 3000
describe('basic text styles', async () => {
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
            if (!$el) {
                throw new Error(`Element with text "${text}" not found`);
            }
            const styleProperties = await page.evaluate(el => {
                const cssObj = getComputedStyle(el);
                const getProperties = (cssObj, properties) => {
                    return properties.reduce((acc, curr) => {
                        acc[curr] = cssObj.getPropertyValue(curr);
                        return acc;
                    }, {});
                };
                return getProperties(cssObj, ['font-size', 'font-family', 'line-height', 'font-weight', 'letter-spacing', 'color']);
            }, $el);
            expect(styleProperties).toMatchSnapshot();
        }
    };

    test('hero', async () => {
        await runTest('hero', ['Омск', '8-800-555-55-55', 'Тренажёрный зал', 'Купить абонемент']);
    });

    test('about', async () => {
        await runTest('about', ['Тренажерный зал', 'Просторный зал', 'самый большой фитнес центр']);
    });
    test('price', async () => {
        await runTest('price', [
            'Абонементы',
            '1 месяц',
            '6 месяцев',
            'С тренером',
            '12 занятий',
            'Купить абонемент',
            'Дневной',
            'с 8:00 до 17:00'
        ]);
    });
    test('games', async () => {
        await runTest('games', [
            'Super games',
            'Дата',
            '7',
            'Марта 2019',
            'Время',
            '12:00',
            'Заполнить заявку',
            'Ежегодные соревнования',
            'Жюри',
            'Анна Павлова',
            'Certified',
            'Победитель чемпионата России',
            'Опыт',

        ]);
    });
    test('features', async () => {
        await runTest('features', [
            'Наши преимущества',
            '900',
            'кв/м',
            'Площадь',
            'Занимайтесь без',
            '100',
            'Тренажеров',
            'Современные тренажеры',
        ]);
    });
    test('offers', async () => {
        await runTest('offers', [
            'Акции',
            'Год',
            '4999',
            'Безлимитный абонемент',
            'Подробнее',
            'Месяц бесплатно',
            'Приведи друга',
            'Скидка',
            'Корпоративный фитнес',
            ''
        ]);
    })
    test('faq', async () => {
        await runTest('faq', [
            'Вопросы и ответы',
            'Центр',
            'Абонемент',
            'Как стать членом',
            'При первом посещении',
            'Где можно посмотреть',
            'Какие дополнительные правила',
            'Для тренировок необходимо',
        ]);
    });
    test('reviews', async () => {
        await runTest('reviews', [
            'Отзывы',
            'Анна Орлова',
            'больше года',
        ]);
    });
    test('footer', async () => {
        await runTest('footer', [
            'Бесплатное занятие',
            'Отправить',
            'Контакты',
            'Адрес',
            '60 лет Октября',
            'График работы:',
            'Пн-Вс: с 8:00 до 22:00',
            'Телефон:',
            '8-800-555-55-55',
            'Email:',
            'omsk@supergym.ru',
            'Услуги',
            'Абонементы',
            ''
        ]);
    });
})

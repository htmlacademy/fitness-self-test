import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import type {PreviewServer} from 'vite'
import {preview} from 'vite'
import type {Browser, ElementHandle, Page} from 'puppeteer'
import {launch} from 'puppeteer'

const PORT = 3000
describe('basic text styles', async () => {
    let server: PreviewServer
    let browser: Browser

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
    })

    afterAll(async () => {
        await browser.close()
        await new Promise<void>((resolve, reject) => {
            server.httpServer.close(error => error ? reject(error) : resolve())
        })
    })

    const getByText = ($container: ElementHandle<Element>, text: string) => {
        return $container.$$(`xpath/.//*[contains(text(), '${text}')]`)
    }


    type Test = { name: string, parameters: string[] };

    const tests: Test[] = [
        {
            name: 'hero',
            parameters: ['Омск', '8-800-555-55-55', 'Тренажёрный зал', 'Купить абонемент']
        },
        {
            name: 'about',
            parameters: ['Тренажерный зал', 'Просторный зал', 'самый большой фитнес центр']
        },
        {
            name: 'price',
            parameters: [
                'Абонементы',
                '1 месяц',
                '6 месяцев',
                'С тренером',
                '12 занятий',
                'Купить абонемент',
                'Дневной',
                'с 8:00 до 17:00'
            ]
        },
        {
            name: 'games',
            parameters: [
                'Super games',
                'Дата',
                '7',
                'Марта',
                '2019',
                'Время',
                '12:00',
                'Заполнить заявку',
                'Ежегодные соревнования',
                'Жюри',
                'Анна Павлова',
                'Александр Пашков',
                'CrossFit',
                'Certified',
                'Победитель чемпионата России',
                'Опыт'
            ]
        },
        {
            name: 'features',
            parameters: [
                'Наши преимущества',
                '900',
                'кв/м',
                'Площадь',
                'Занимайтесь без',
                '100',
                'Тренажеров',
                'Современные тренажеры',
            ]
        },
        {
            name: 'offers',
            parameters: [
                'Акции',
                'Год',
                '4999',
                'Безлимитный абонемент',
                'Подробнее',
                'Месяц бесплатно',
                'Приведи друга',
                'Скидка',
                'Корпоративный фитнес'
            ]
        },
        {
            name: 'faq',
            parameters: [
                'Вопросы и ответы',
                'Центр',
                'Абонемент',
                'Как стать членом',
                'При первом посещении',
                'Где можно посмотреть',
                'Какие дополнительные правила',
                'Для тренировок необходимо',
            ]
        },
        {
            name: 'reviews',
            parameters: [
                'Отзывы',
                'Анна Орлова',
                'больше года',
            ]
        },
        {
            name: 'footer',
            parameters: [
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
            ]
        }
    ];

    async function runViewportTest(viewport: { width: number, height: number }, tests: Test[]) {
        let page: Page;
        beforeAll(async () => {
            page = await browser.newPage()
            await page.setViewport(viewport);
            await page.goto(`http://localhost:${PORT}`, {waitUntil: 'networkidle0'})
        });
        for (const { name: testName, parameters: elements } of tests) {
            describe(testName, async () => {
                let $container: ElementHandle<Element>;
                beforeAll(async () => {
                    $container = await page.$(`[data-test="${testName}"]`);
                    if (!$container) {
                        throw new Error(`Container with data-test="${testName}" not found`);
                    }
                    for (const text of elements) {
                        const [$el] = await getByText($container, text);
                        if (!$el) {
                            throw new Error(`Element with text "${text}" not found in ${testName} container`);
                        }
                    }
                })

                for (const text of elements) {
                    test(text, async () => {
                        const [$el] = await getByText($container, text);
                        const styleProperties = await page.evaluate(el => {
                            const cssObj = getComputedStyle(el);
                            const getProperties = (cssObj: CSSStyleDeclaration, properties: string[]) => {
                                return properties.reduce((acc, curr) => {
                                    acc[curr] = cssObj.getPropertyValue(curr);
                                    return acc;
                                }, {});
                            };
                            return getProperties(cssObj, ['font-size', 'font-family', 'line-height', 'font-weight', 'letter-spacing', 'color']);
                        }, $el);
                        expect({...styleProperties, text}).toMatchSnapshot();
                    })
                }
            });
        }
    }

    describe('desktop', async () => {
        await runViewportTest({width: 1600, height: 800}, tests);
    })
    describe('tablet', async () => {
        await runViewportTest({width: 1024, height: 800}, tests);
    })
    describe('mobile', async () => {
        await runViewportTest({width: 375, height: 800}, tests);
    })
})

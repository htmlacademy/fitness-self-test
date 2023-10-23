- установите зависимости командой `npm i`
- перенесите **собранный** проект в папку `build`
- запустите тестирование на соответствия макету с помощью команды `npm test`
- в проекте должны быть data-атрибуты `data-test="..."`
  - hero
  - about
  - price
  - games
  - features
  - offers
  - faq
  - reviews
  - footer

если у вас другие секции в разметке - объедините их дивами под эту структуру

например так 
```html
...
<div data-test="hero">
  <header class="header"></header>
  <section class="hero"> </section>
</div>
<div class="page-section" data-test="about"></div>
<section data-test="price" class="subscriptions" id="subscriptions"></section>
<div data-test="games">
  <div class="page-section">
    <div class="banner"></div>
  </div>
  <div class="page-section"></section>
</div>
<section data-test="features" class="advantages"></section>
...
```
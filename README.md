## AI product transformer small PoC

### Description

The goal of the PoC is to demonstrate, how could be implemented a two-step AI product feed transformer from a customer product feed to a given unified feed format:
1. First step - creating and saving of the converter.
2. Second step - loading and running of the converter.

### Demo run

1. Clone the repository:
```shell
git clone https://github.com/a-bobkov/ai-product-transformer.git && cd ai-product-transformer
```
2. Copy the [envExample.js](envExample.js) into `envDev.js` and set your value for `OPENAI_API_KEY`:
```shell
cp envExample.js envDev.js
```
3. Run in terminal:
```shell
time node learn.js
```
4. See the log:
```shell
Learning to transform customer feed from source id: example_1

Learning by example customer feed:  [
  {
    ID: 11,
    SKU: '1234567-00001',
    BESCHREIBUNG: 'Stuhl Bellevue',
    PREIS: '39,80 EUR',
    FARBE: 'Schwarz',
    GROSSE: '60 cm',
    BILD_URL: 'https://dj2hx6apm0rq.cloudfront.net/images/C04E90C7-2044-41EA-A34E-F5E79D8ABB0F/?S=865&F=WEBP?S=865&F=WEBP',
    KATEGORIE: 'Stühle'
  }
]

Converter is created with length 6638 chars and saved into file: ./converters/example_1/converter.js
node learn.js  0,29s user 0,09s system 0% cpu 2:21,70 total
```
5. See the result - saved converter is a valid JavaScript function:
```shell
less ./converters/example_1/converter.js
```
6. Run in terminal:
```shell
node transform.js
```
7. See the log:
```shell
Transforming customer feed from source id: example_1

Source customer feed:  [
  {
    ID: 11,
    SKU: '1234567-00001',
    BESCHREIBUNG: 'Stuhl Bellevue',
    PREIS: '39,80 EUR',
    FARBE: 'Schwarz',
    GROSSE: '60 cm',
    BILD_URL: 'https://dj2hx6apm0rq.cloudfront.net/images/C04E90C7-2044-41EA-A34E-F5E79D8ABB0F/?S=865&F=WEBP?S=865&F=WEBP',
    KATEGORIE: 'Stühle'
  }
]

Result unified feed:  [
  {
    id: '11',
    sku: '1234567-00001',
    name: 'Stuhl Bellevue',
    price: 3980,
    priceUnit: 'EUR cent',
    category: 'Stühle',
    color: 'Schwarz',
    imageUrl: 'https://dj2hx6apm0rq.cloudfront.net/images/C04E90C7-2044-41EA-A34E-F5E79D8ABB0F/?S=865&F=WEBP?S=865&F=WEBP',
    size: '60 cm'
  }
]
```
8. See the result - saved transformed feed meets the requirements of the scheme `unifiedProductFormat.json`:
```shell
cat feeds_out/example_1/unifiedProductFeed.json
```

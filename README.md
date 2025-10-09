## AI product transformer small PoC

### Demo run

1. Clone the repository:
```shell
git clone https://github.com/a-bobkov/ai-product-transformer.git && cd ai-product-transformer
```
2. Create a chat with Chat GPT: https://chatgpt.com
3. Upload files [outputFormatProduct.json](outputFormatProduct.json) and [in/exampleProductFeed.json](in/exampleProductFeed.json) to the chat.
4. Copy-paste the text from file [prompt.txt](prompt.txt) to the chat and submit it.
5. Copy from ChatGPT the result "out/exampleConverter.js" to a local file and run it:
```shell
node out/exampleConverter.js
```
6. See the example converted products in the file [out/exampleConvertedProducts.json](out/exampleConvertedProducts.json)
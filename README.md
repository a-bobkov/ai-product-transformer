This a PoC of AI product transformer

Demo run:

1. Create a chat with Chat GPT.
2. Upload files [outputFormatProduct.json](outputFormatProduct.json) and [exampleProductFeed.json](in/exampleProductFeed.json) to the chat.
3. Copy-paste the text from file [prompt.txt](prompt.txt) to the chat and press Enter.
4. Copy the result "exampleConverter.js" from ChatGPT to the local file and run it:
```
node out/exampleConverter.js
```
5. See the example converted products in the file [exampleConvertedProducts.json](out/exampleConvertedProducts.json)
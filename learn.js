import { env } from './envDev.js';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'timers/promises';
import OpenAI from 'openai';

await main();

async function main()
{
  const sourceId = getKey( env, 'CUSTOMER_PRODUCT_FEED_SOURCE_ID' );

  const sourceName = getKey( env, 'CUSTOMER_PRODUCT_FEED_SOURCE_NAME' );

  const sourcePath = `./feeds_in/${ sourceId }/${ sourceName }`;

  await printLearningParameters( sourceId, sourcePath );

  const converterCode = await createConverterCode( sourcePath );

  await saveConverterCode( sourceId,  converterCode );
}

async function printLearningParameters( sourceId, sourcePath )
{
  console.log(`\nLearning to transform customer feed from source id: ${ sourceId }`);

  const sourceFeed = await readFile( sourcePath, 'utf-8');

  console.log('\nLearning by example customer feed: ', JSON.parse( sourceFeed ));
}

async function createConverterCode( sourcePath )
{
  const openai = new OpenAI({
    apiKey: getKey( env, 'OPENAI_API_KEY' ),
  });

  const customerProductFeedSourceFile = await openai.files.create({
    file: createReadStream(sourcePath),
    purpose: 'fine-tune',
    expires_after: {
      anchor: 'created_at',
      seconds: 3600,
    },
  });

  const unifiedProductFormatFile = await openai.files.create({
    file: createReadStream('./unifiedProductFormat.json'),
    purpose: 'fine-tune',
    expires_after: {
      anchor: 'created_at',
      seconds: 3600,
    },
  });

  await delay(5000);

  const response = await openai.responses.create({
    model: 'gpt-5',
    tools: [{
      type: 'code_interpreter',
      container: {
        type: 'auto',
        file_ids: [
          customerProductFeedSourceFile.id,
          unifiedProductFormatFile.id,
        ],
      },
    }],
    input: [{
      role: 'user',
      content: [{
        type: 'input_text',
        text: 'Create converter as a Node.js JavaScript function declaration, which can be passed as an argument of eval(). The input parameter of the converter should be array of objects, as an example given in the uploaded file "customerProductFeed.json". Result of the converter should be returned as array of objects. Format of the output objects is given in the uploaded file "unifiedProductFormat.json". The converter should use absolutely no dependencies and use the latest JavaScript syntax, supported by Node.js 22. Do not write anything except JavaScript code.',
      }],
    }],
  });

  return response.output_text;
}

async function saveConverterCode( sourceId, converterCode )
{
  const converterDir = `./converters/${ sourceId }`;

  await mkdir( converterDir, { recursive: true });

  const converterPath = `${ converterDir }/converter.js`;

  await writeFile( converterPath, converterCode );

  console.log(`\nConverter is created with length ${ converterCode.length } chars and saved into file: ${ converterPath }`);
}

function getKey( env, key )
{
  const value = env[key];

  if (value === undefined) {
    throw new Error(`Please provide value for "${ key }" in the env-file`);
  }

  return value;
}

import { env } from './envDev.js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

await main();

async function main()
{
  const sourceId = getKey( env, 'CUSTOMER_PRODUCT_FEED_SOURCE_ID' );

  const sourceFeed = await readSourceFeed( sourceId );

  const resultFeed = await convertFeed( sourceId, sourceFeed );

  await saveResultFeed( sourceId, resultFeed );

  printResults( sourceId, sourceFeed, resultFeed );
}

function printResults( sourceId, sourceFeed, resultFeed )
{
  console.log(`\nTransforming customer feed from source id: ${ sourceId }`);

  console.log('\nSource customer feed: ', JSON.parse( sourceFeed ));

  console.log('\nResult unified feed: ', JSON.parse( resultFeed ));
}

async function readSourceFeed( sourceId )
{
  const sourceName = getKey( env, 'CUSTOMER_PRODUCT_FEED_SOURCE_NAME' );

  const sourcePath = `./feeds_in/${ sourceId }/${ sourceName }`;

  return await readFile( sourcePath, 'utf-8');
}

async function convertFeed( sourceId, sourceFeed )
{
  const converterDir = `./converters/${ sourceId }`;

  const converterPath = `${ converterDir }/converter.js`;

  const converterCode = await readFile( converterPath, 'utf-8');

  const result = eval(`(${ converterCode })(JSON.parse(\`${ sourceFeed }\`))`);

  return JSON.stringify( result );
}

async function saveResultFeed( sourceId, resultFeed )
{
  const feedOutDir = `./feeds_out/${ sourceId }`;

  await mkdir( feedOutDir, { recursive: true });

  const feedOutPath = `${ feedOutDir }/unifiedProductFeed.json`;

  await writeFile( feedOutPath, resultFeed );
}

function getKey( env, key )
{
  const value = env[key];

  if (value === undefined) {
    throw new Error(`Please provide value for "${ key }" in the env-file`);
  }

  return value;
}

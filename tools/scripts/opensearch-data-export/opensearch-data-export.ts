import fs from 'fs/promises';
import appRootDir from 'app-root-dir';
import { Client } from '@opensearch-project/opensearch';
import path from 'path';
import config from './config/opensearch-data-export.json';

function createOpenSearchClient() {
  const { opensearchInstance, user, password } = config;
  const url = new URL(config.opensearchInstance);

  // Optional client certificates if you don't want to use HTTP basic authentication.
  // var client_cert_path = '/full/path/to/client.pem'
  // var client_key_path = '/full/path/to/client-key.pem'

  // Create a client with SSL/TLS enabled.
  const client = new Client({
    node: `${url.protocol}://${user}:${password}@${url.hostname}:${url.port}`,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return client;
}

async function readDatastore() {
  const datastoreFilePath = path.join(
    appRootDir.get(),
    'config',
    'MMM-LKY-TIC.datastore.json'
  );
  const contents = await fs.readFile(datastoreFilePath, 'utf8');
  return JSON.parse(contents);
}

async function main(args) {
  console.log('Loaded configuration:', config);

  const [datastorePath, dayOrMonth, indexName] = args;

  console.log('Ready!');

  const client = createOpenSearchClient();

  const dataStore = await readDatastore();

  Object.entries(dataStore).reduce(acc, ([k, v]) => {
    
  }, {});

  console.log('Adding document:');

  const document = {
    title: 'The Outsider',
    author: 'Stephen King',
    year: '2018',
    genre: 'Crime fiction',
  };

  const id = ``;

  var response = await client.index({
    id: id,
    index: indexName,
    body: document,
    refresh: true,
  });

  console.log(response.body);

}

main(process.argv);

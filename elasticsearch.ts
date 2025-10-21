// backend/src/config/elasticsearch.ts
import { Client } from "@elastic/elasticsearch";
import ENV from "./env";

let client: Client;

function createClient(): Client {
  const node = ENV.ELASTICSEARCH_URL;
  const username = ENV.ELASTICSEARCH_USERNAME;
  const password = ENV.ELASTICSEARCH_PASSWORD;

  const options: any = { node };

  if (username && password) {
    options.auth = { username, password };
  }

  const c = new Client(options);

  // optional: simple ping to ensure ES is reachable on startup
  c.ping()
    .then(() => {
      console.info("[elasticsearch] connected to", node);
    })
    .catch((err) => {
      console.warn(
        "[elasticsearch] ping failed — Elasticsearch may not be available at %s. Error: %s",
        node,
        err?.message ?? err
      );
    });

  return c;
}

export function getElasticsearchClient(): Client {
  if (!client) {
    client = createClient();
  }
  return client;
}

import { Client } from "@elastic/elasticsearch";

export const es = new Client({
  node: "http://elasticsearch:9200",
});

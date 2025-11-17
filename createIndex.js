import fetch from "node-fetch";

async function createIndex() {
  const res = await fetch("http://localhost:9200/documents", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      settings: {
        number_of_shards: 1,
        number_of_replicas: 0
      },
      mappings: {
        properties: {
          title:   { type: "text" },
          content: { type: "text" }
        }
      }
    })
  });

  console.log(await res.json());
}

createIndex();

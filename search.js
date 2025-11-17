import fetch from "node-fetch";

const ELASTIC_URL = "http://localhost:9200";
const INDEX_NAME = "documents";

async function search(query) {
  const response = await fetch(`${ELASTIC_URL}/${INDEX_NAME}/_search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {
        multi_match: {
          query,
          fields: ["title", "content"]
        }
      }
    }),
  });

  const data = await response.json();
  return data.hits.hits;
}

// Test local
search("test").then(results => {
  console.log("Résultats :", results);
});

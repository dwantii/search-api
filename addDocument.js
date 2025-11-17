import fetch from "node-fetch";

const ELASTIC_URL = "http://localhost:9200";
const INDEX_NAME = "documents";

async function addDocument(doc) {
  const response = await fetch(`${ELASTIC_URL}/${INDEX_NAME}/_doc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });

  const data = await response.json();
  console.log(data);
}

addDocument({
  title: "Mon premier document",
  content: "Ceci est un test du moteur de recherche full-text.",
});

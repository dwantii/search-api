import express from "express";
import { es } from "../elastic.js";
import { redis } from "../redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q;

  if (!q) return res.json([]);

  // cache
  const cached = await redis.get(q);
  if (cached) return res.json(JSON.parse(cached));

  // Elastic search
  const result = await es.search({
    index: "documents",
    query: {
      multi_match: {
        query: q,
        fields: ["title", "content"],
      },
    },
  });

  const hits = result.hits.hits.map((h) => h._source);

  await redis.set(q, JSON.stringify(hits), "EX", 60);

  res.json(hits);
});

export default router;

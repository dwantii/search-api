import express from "express";
import cors from "cors";
import { Client } from "@elastic/elasticsearch";
import Redis from "ioredis";

const app = express();
app.use(express.json());
app.use(cors());

const es = new Client({
	node: "http://elasticsearch:9200",
});

const redis = new Redis({
	host: "redis",
	port: 6379,
});

app.get("/health", (req, res) => {
	res.json({ ok: true });
});

app.post("/search", async (req, res) => {
	try {
		const { query } = req.body;

		if (!query || query.trim() === "") {
			return res.status(400).json({ error: "Missing 'query' field" });
		}

		const cached = await redis.get(query);
		if (cached) {
			console.log("→ Cache HIT");
			return res.json(JSON.parse(cached));
		}

		console.log("→ Cache MISS, search in Elasticsearch");

		const result = await es.search({
			index: "documents",
			query: {
				multi_match: {
					query,
					fields: ["title", "content"],
				},
			},
		});

		const hits = result.hits.hits.map((hit) => ({
			id: hit._id,
			score: hit._score,
			...hit._source,
		}));

		await redis.set(query, JSON.stringify(hits), "EX", 3600);

		return res.json(hits);
	} catch (error) {
		console.error("SEARCH ERROR :", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(3002, () => {
	console.log("Search API running on port 3002");
});


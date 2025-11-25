import Redis from "ioredis";

export const redis = new Redis({
  host: "search_redis", 
  port: 6379,
});

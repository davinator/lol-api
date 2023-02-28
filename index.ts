import express, { Express } from "express";

import getSummonerMatches from "./endpoints/getSummonerMatches";

const app: Express = express();
const port = process.env.LOL_API_PORT || 3001;

app.get("/summoner/matches", getSummonerMatches);

app.listen(port, () => {
  console.log(`Server up! http://localhost:${port}`);
});

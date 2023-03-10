import express, { Express, Request, Response } from "express";
import cors from "cors";
import getSummonerMatches from "./endpoints/getSummonerMatches";

const app: Express = express();
const port = process.env.LOL_API_PORT || 3001;

app.use(
  cors({
    origin: process.env.LOL_CLIENT_APP_URL || "*",
  })
);

app.get("/summoner/matches", getSummonerMatches);
app.get("/health-check", (req: Request, res: Response) => res.send(""));

app.listen(port, () => {
  console.log(`Server up! http://localhost:${port}`);
});

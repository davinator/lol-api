import { Request, Response } from "express";

export default async function getSummonerMatches(
  req: Request,
  res: Response
): Promise<void> {
  res.send(JSON.stringify(req.query));
}

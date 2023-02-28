import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { defaultHeaders } from "../contants";
import lolApi from "../../libs/lolApi";

export default async function getSummonerMatches(
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
): Promise<void> {
  const puuidResp = await handleLolApiOutput(
    () => lolApi.getSummonerPuuid((req.query.name as string) || ""),
    res,
    next
  );
  if (!puuidResp) return;
  const puuid: string = puuidResp.puuid;

  const matchIds: string[] = await handleLolApiOutput(
    () => lolApi.getMatches(puuid),
    res,
    next
  );
  if (!matchIds) return;

  const matches = await Promise.all(
    matchIds.map((matchId) =>
      handleLolApiOutput(() => lolApi.getMatch(matchId), res, next)
    )
  );

  res.set(defaultHeaders);
  res.send(JSON.stringify(matches));
  return;
}

async function handleLolApiOutput(
  apiCall: () => Promise<Response>,
  res: ExpressResponse,
  next: NextFunction,
  retries = 0
): Promise<any> {
  let data;
  try {
    data = await apiCall();
  } catch (error) {
    next(error);
    return;
  }

  if (data.ok) return data.json();

  if (data.status == 429) {
    if (retries >= 3) {
      next(new Error("Too many requests. Please try again later"));
      return;
    }

    handleLolApiOutput(apiCall, res, next, retries + 1);
  }

  if (data.status == 404) {
    res.status(404).send(
      JSON.stringify({
        message: "Summoner data not found.",
      })
    );
    return;
  }

  console.log(`
    LOL API call failed:
    Code: ${data.status} - ${data.statusText}
    Url: ${data.url}
    Body: ${await data.text()}
  `);
  next(
    new Error(
      "Your request could not be completed due to an error. Please try again later"
    )
  );
}

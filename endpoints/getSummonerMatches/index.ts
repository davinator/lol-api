import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { defaultHeaders } from "../contants";
import lolApi from "../../libs/lolApi";

export default async function getSummonerMatches(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const puuidResp = await handleLolApiOutput(
    () => lolApi.getSummonerPuuid((req.query.name as string) || ""),
    res
  );
  if (!puuidResp) return;
  const puuid: string = puuidResp.puuid;

  const matchIds: string[] = await handleLolApiOutput(
    () => lolApi.getMatches(puuid),
    res
  );
  if (!matchIds) return;

  const matches = await Promise.all(
    matchIds.map((matchId) =>
      handleLolApiOutput(() => lolApi.getMatch(matchId), res)
    )
  );
  if (!matches) return;

  res.set(defaultHeaders).json(matches);
}

async function handleLolApiOutput(
  apiCall: () => Promise<Response>,
  res: ExpressResponse,
  retries = 0
): Promise<any> {
  let data;
  try {
    data = await apiCall();
  } catch (error) {
    sendError(res, 500, "Unknow internal error. Please try again later");
    return;
  }

  if (data.ok) return data.json();

  if (data.status == 429) {
    if (retries >= 3) {
      sendError(res, 429, "Too many requests. Please try again later");
      return;
    }

    return new Promise((resolve) => {
      setTimeout(
        () => resolve(handleLolApiOutput(apiCall, res, retries + 1)),
        1000
      );
    });
  }

  if (data.status == 404) {
    return;
  }

  console.log(`
    LOL API call failed:
    Code: ${data.status} - ${data.statusText}
    Url: ${data.url}
    Body: ${await data.text()}
  `);
  sendError(
    res,
    500,
    "Your request could not be completed due to an error. Please try again later"
  );
}

function sendError(res: ExpressResponse, errorCode: number, message: string) {
  res.status(errorCode).json({
    message,
  });
}

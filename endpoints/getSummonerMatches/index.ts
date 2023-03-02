import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { defaultHeaders } from "../contants";
import lolApi, { ApiError } from "../../libs/lolApi";

export default async function getSummonerMatches(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<void> {
  let summoner;
  let matchIds;
  let matches;

  try {
    summoner = await lolApi.getSummoner((req.query.name as string) || "");
  } catch (error: any) {
    return sendError(res, error.code, error.message);
  }

  try {
    matchIds = await lolApi.getMatches(summoner.puuid as string);
  } catch (error: any) {
    return sendError(res, error.code, error.message);
  }

  try {
    matches = await Promise.all(
      matchIds.map((matchId: string) => lolApi.getMatch(matchId))
    );
  } catch (error: any) {
    return sendError(res, error.code, error.message);
  }

  res.set(defaultHeaders).json(formatMatchesData(summoner.puuid, matches));
}

function formatMatchesData(puuid: string, matches: any) {
  // Pulls the player data for the match from the participants array
  // and put it into a dedicated summoner object key
  return matches.map((match: any) => ({
    metadata: match.metadata,
    info: {
      ...match.info,
      summoner: match.info.participants.find(
        (player: any) => player.puuid === puuid
      ),
    },
  }));
}

async function handleLolApiOutput(
  apiCall: () => Promise<Response>,
  retries = 0
): Promise<any> {
  // Some common error handling for the API calls.
  // Returns the results or throws an ApiError
}

function sendError(res: ExpressResponse, errorCode: number, message: string) {
  res.status(errorCode).json({
    message,
  });
}

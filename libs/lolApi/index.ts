export class ApiError extends Error {
  public code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

class LolApi {
  private apiKey: string;

  request = async (
    endpoint: string,
    query?: Record<string, string>,
    method: string = "GET",
    retries = 0
  ): Promise<any> => {
    const url = query ? `${endpoint}?${new URLSearchParams(query)}` : endpoint;

    let data: Response;

    try {
      data = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Riot-Token": this.apiKey,
        },
      });
    } catch {
      throw new ApiError("Unknow internal error. Please try again later", 500);
    }

    if (data.ok) return data.json();

    if (data.status === 429) {
      if (retries >= 3) {
        throw new ApiError("Too many requests. Please try again later", 429);
      }

      return new Promise((resolve) => {
        setTimeout(
          () => resolve(this.request(endpoint, query, method, retries + 1)),
          1000
        );
      });
    }

    if (data.status === 404) {
      throw new ApiError("Summoner or match not found", 404);
    }

    console.log(`
      LOL API call failed:
      Code: ${data.status} - ${data.statusText}
      Url: ${data.url}
      Body: ${await data.text()}
    `);
    throw new ApiError(
      "Your request could not be completed due to an error. Please try again later",
      500
    );
  };

  getSummoner = async (name: string) => {
    return this.request(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`
    );
  };

  getMatches = async (puuid: string) => {
    return this.request(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      { start: "0", count: "5" }
    );
  };

  getMatch = async (matchId: string) => {
    return this.request(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`
    );
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
}

const lolApi = new LolApi(process.env.LOL_API_KEY || "");
export default lolApi;

class LolApi {
  private apiKey: string;

  request = async (
    endpoint: string,
    query?: Record<string, string>,
    method: string = "GET"
  ): Promise<Response> => {
    const url = query ? `${endpoint}?${new URLSearchParams(query)}` : endpoint;
    return fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Riot-Token": this.apiKey,
      },
    });
  };

  getSummonerPuuid = async (name: string) => {
    return this.request(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`
    );
  };

  getMatches = async (puuid: string) => {
    return this.request(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`
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

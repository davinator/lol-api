import { jest, describe, beforeAll, expect, test } from "@jest/globals";
import lolApi, { ApiError } from ".";

describe("lolApi", () => {
  describe("Successfull fetch", () => {
    beforeAll(() => {
      jest.spyOn(global, "fetch").mockReturnValue(
        Promise.resolve({
          ok: true,
          json: async () => ({
            data: "success",
          }),
        } as Response)
      );
    });

    test("getSummoner", async () => {
      const response = await lolApi.getSummoner("name");
      expect(response).toEqual({ data: "success" });
    });
    test("getMatch", async () => {
      const response = await lolApi.getMatch("puuid");
      expect(response).toEqual({ data: "success" });
    });
    test("getMatches", async () => {
      const response = await lolApi.getMatches("matchId");
      expect(response).toEqual({ data: "success" });
    });
  });

  describe("Fetchs an error response", () => {
    beforeAll(() => {
      jest.spyOn(global, "fetch").mockReturnValue(
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );
    });

    test("getSummoner", async () => {
      await expect(async () => lolApi.getSummoner("name")).rejects.toThrow(
        ApiError
      );
    });
    test("getMatch", async () => {
      await expect(async () => lolApi.getMatch("puuid")).rejects.toThrow(
        ApiError
      );
    });
    test("getMatches", async () => {
      await expect(async () => lolApi.getMatches("matchId")).rejects.toThrow(
        ApiError
      );
    });
  });
});

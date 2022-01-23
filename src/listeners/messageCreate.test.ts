import { getNormalizedUrl, getUrlFromMessage } from "./messageCreate";

describe("messageCreate.ts", () => {
  describe("getUrlFromMessage", () => {
    test("should return url from within message", () => {
      const url = getUrlFromMessage(
        "Ok here's the link https://twitter.com/blknoiz06/status/1483297295126913024 yeah that's it"
      );

      expect(url).toEqual(
        "https://twitter.com/blknoiz06/status/1483297295126913024"
      );
    });

    test("should handle period or comma at the end", () => {
      expect(
        getUrlFromMessage(
          "Ok here's the link https://twitter.com/blknoiz06/status/1483297295126913024. yeah that's it"
        )
      ).toEqual("https://twitter.com/blknoiz06/status/1483297295126913024");

      expect(
        getUrlFromMessage(
          "Ok here's the link https://twitter.com/blknoiz06/status/1483297295126913024, yeah that's it"
        )
      ).toEqual("https://twitter.com/blknoiz06/status/1483297295126913024");
    });

    test("should return null if no url in message", () => {
      const url = getUrlFromMessage("Ok here's the link");

      expect(url).toBeNull();
    });
  });

  describe("getNormalizedUrl", () => {
    test("should return url without params", () => {
      const url = getNormalizedUrl(
        "https://twitter.com/blknoiz06/status/1483297295126913024?s=20231234"
      );

      expect(url).toEqual(
        "https://twitter.com/blknoiz06/status/1483297295126913024"
      );
    });

    test("for youtube, should return url with params", () => {
      const url = getNormalizedUrl(
        "https://www.youtube.com/watch?v=9UNuqYFP-pM"
      );

      expect(url).toEqual("https://www.youtube.com/watch?v=9UNuqYFP-pM");
    });
  });
});

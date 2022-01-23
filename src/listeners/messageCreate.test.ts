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

    test("should handle no https", () => {
      expect(
        getUrlFromMessage(
          "Ok here's the link www.twitter.com/blknoiz06/status/1483297295126913024 yeah that's it"
        )
      ).toEqual("www.twitter.com/blknoiz06/status/1483297295126913024");
    });

    test("should handle no https or www", () => {
      expect(
        getUrlFromMessage(
          "Ok here's the link twitter.com/blknoiz06/status/1483297295126913024 yeah that's it"
        )
      ).toEqual("twitter.com/blknoiz06/status/1483297295126913024");
    });

    test("should handle multiple urls and return the second URL", () => {
      expect(
        getUrlFromMessage(
          "Ok here's the link https://www.twitter.com/blknoiz06/status/1483297295126913024 yeah that's it https://twitter.com/Lethain/status/1240663949575467008"
        )
      ).toEqual("https://www.twitter.com/blknoiz06/status/1483297295126913024");
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
      expect(
        getNormalizedUrl(
          "https://twitter.com/blknoiz06/status/1483297295126913024?s=20231234"
        )
      ).toEqual("https://twitter.com/blknoiz06/status/1483297295126913024");

      expect(
        getNormalizedUrl(
          "https://www.twitter.com/blknoiz06/status/1483297295126913024?s=20231234"
        )
      ).toEqual("https://twitter.com/blknoiz06/status/1483297295126913024");

      expect(
        getNormalizedUrl(
          "www.twitter.com/blknoiz06/status/1483297295126913024?s=20231234"
        )
      ).toEqual("https://twitter.com/blknoiz06/status/1483297295126913024");

      expect(
        getNormalizedUrl(
          "twitter.com/blknoiz06/status/1483297295126913024?s=20231234"
        )
      ).toEqual("https://twitter.com/blknoiz06/status/1483297295126913024");
    });

    test("for youtube, should return url with params", () => {
      expect(
        getNormalizedUrl("https://www.youtube.com/watch?v=9UNuqYFP-pM")
      ).toEqual("https://youtube.com/watch?v=9UNuqYFP-pM");
    });
  });
});

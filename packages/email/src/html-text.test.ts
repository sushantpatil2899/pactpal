import { describe, expect, it } from "vitest";
import { htmlToText } from "./index.js";

describe("htmlToText", () => {
  it("keeps the readable text, one block per line, with entities decoded", () => {
    const html =
      "<html><head><style>p{color:red}</style></head><body><!-- hi --><div>Rosa: Three pages &amp; hosting</div><p>Daniel:&nbsp;&nbsp;It&#39;s $900 &lt;total&gt;<br>Thanks&#x21;</p><script>alert(1)</script><p>&copy; ok</p></body></html>";
    expect(htmlToText(html)).toBe(
      "Rosa: Three pages & hosting\nDaniel: It's $900 <total>\nThanks!\n&copy; ok",
    );
  });

  it("joins blank lines and copes with odd entities", () => {
    expect(htmlToText("x &#0; &#x; y")).toBe("x y");
    expect(htmlToText("<p>a</p><p></p><p></p><p>b</p>")).toBe("a\n\nb");
  });
});

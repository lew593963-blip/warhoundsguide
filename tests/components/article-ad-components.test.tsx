import {render} from "@testing-library/react";
import {describe, expect, it} from "vitest";

import {createArticleAdComponents} from "@/components/article-renderer";

describe("article MDX ad component registry", () => {
  it("keeps both MDX component names available as no-ops when Adsterra is disabled", () => {
    const components = createArticleAdComponents({enabled: false});

    expect(Object.keys(components)).toEqual([
      "AdsterraInlineOne",
      "AdsterraInlineTwo",
    ]);
    const First = components.AdsterraInlineOne;
    const Second = components.AdsterraInlineTwo;
    const {container} = render(<><First /><Second /></>);
    expect(container).toBeEmptyDOMElement();
  });
});

import { Footer } from "../shell/layouts";
import { Closing } from "./closing/Closing";
import { Council } from "./council/Council";
import { Dispute } from "./dispute/Dispute";
import { Features } from "./features/Features";
import { Rails } from "./paypal/Rails";
import { Tour } from "./tour/Tour";
import { Hero } from "./hero/Hero";
import { Ledger } from "./ledger/Ledger";
import { Audience } from "./audience/Audience";
import { Agents } from "./agents/Agents";
import { Moves } from "./moves/Moves";
import { Nav } from "./Nav";
import { Pillars } from "./pillars/Pillars";
import { useScrollStory } from "./useScrollStory";
import "../deal/deal.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./landing.css";
import "./slice.css";
import "./slice2.css";
import "./slice3.css";
import "./closing/closing.css";

/**
 * The public landing page (`/` when signed out): one story, told as one deal unfolding down the
 * page, with one action: sign in with PayPal. Loaded only for visitors who are signed out.
 */
export function Landing({ problem }: { problem?: string }) {
  useScrollStory();
  return (
    <div className="pp-lp">
      <a className="pp-skip" href="#content">
        Skip to the content
      </a>
      <Nav />
      <main id="content">
        <Hero problem={problem} />
        <Pillars />
        <Audience />
        <Moves />
        <Council />
        <Rails />
        <Ledger />
        <Dispute />
        <Agents />
        <Tour />
        <Features />

        <Closing />
      </main>
      <div className="pp-scope-dark pp-lp-foot">
        <Footer links />
      </div>
    </div>
  );
}

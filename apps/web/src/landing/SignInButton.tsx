import { SIGN_IN_PATH } from "../api";
import { BrandLogo } from "../design/brand-logos";
import { ButtonLink } from "../design/parts";

/** The landing page's one action, with PayPal's mark: in the bar, the hero and the close. */
export function SignInButton({ large = false }: { large?: boolean }) {
  return (
    <ButtonLink look="primary" large={large} href={SIGN_IN_PATH}>
      <BrandLogo name="paypal" color="currentColor" />
      Sign in with PayPal
    </ButtonLink>
  );
}

import { SIGN_IN_PATH } from "./api";
import { Alert, ButtonLink, Field, Label } from "./design/parts";
import "./sign-in.css";

/**
 * The sign-in page: one action, signing in with PayPal. `problem` is why the last try did not
 * finish, in words. It asks for nothing PactPal does not need, and says what signing in shows.
 */
export function SignInPage({ problem }: { problem?: string }) {
  return (
    <Label className="pp-signin">
      <div>
        <h1 className="pp-display">Sign in to PactPal</h1>
        {problem !== undefined && <Alert problem>{problem}</Alert>}
        <p>
          PactPal signs you in through PayPal. PayPal shares your name, your email address and your
          PayPal account's id with PactPal. Your password stays with PayPal.
        </p>
      </div>
      <div className="pp-tape">
        <ButtonLink large href={SIGN_IN_PATH}>
          Sign in with PayPal
        </ButtonLink>
        <span aria-hidden="true">PactPal · PactPal · PactPal · PactPal · PactPal</span>
      </div>
      <div className="pp-signin-facts">
        <Field caption="What signing in shows">
          That you control a PayPal account. It is not proof of legal identity.
        </Field>
        <Field caption="Buyers">Buyers don't need an account: open the link in your email.</Field>
        <Field caption="Test mode">PactPal currently runs in test mode. No real money moves.</Field>
      </div>
    </Label>
  );
}

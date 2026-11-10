import { SIGN_IN_PATH } from "./api";
import { Alert, ButtonLink, Field, Card } from "./design/parts";
import { LogoMark } from "./design/Logo";
import "./sign-in.css";

/**
 * The sign-in page: one action, signing in with PayPal. `problem` is why the last try did not
 * finish, in words. It asks for nothing PactPal does not need, and says what signing in shows.
 */
export function SignInPage({ problem }: { problem?: string }) {
  return (
    <Card className="pp-signin">
      <div>
        <LogoMark className="pp-signin-mark" />
        <h1 className="pp-display">Sign in to PactPal</h1>
        {problem !== undefined && <Alert problem>{problem}</Alert>}
        <p>
          PactPal signs you in through PayPal. PayPal shares your name, your email address and your
          PayPal account&apos;s id with PactPal. Your password stays with PayPal.
        </p>
        <ButtonLink look="primary" large href={SIGN_IN_PATH}>
          Sign in with PayPal
        </ButtonLink>
      </div>
      <div className="pp-signin-facts">
        <Field caption="What signing in shows">
          That you control a PayPal account. It is not proof of legal identity.
        </Field>
        <Field caption="Buyers">
          Buyers don&apos;t need an account: open the link in your email.
        </Field>
        <Field caption="Test mode">PactPal currently runs in test mode. No real money moves.</Field>
      </div>
    </Card>
  );
}

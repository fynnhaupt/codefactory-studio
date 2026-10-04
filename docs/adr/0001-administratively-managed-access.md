# Administratively managed access

Users sign in with email and password using Better Auth. User creation is an administrative responsibility, so public self-registration is disabled on the server as well as omitted from the interface. Password recovery initially goes through an administrator; a user management interface and self-service password reset are outside the sign-in task.

The home page requires a session. After signing in, users go to the localized home page; authenticated visitors to the sign-in page are redirected there as well. Sessions persist across browser restarts using the existing Better Auth session lifetime.

The sign-in interface uses shadcn components, React Hook Form, and a Zod schema. All user-facing text uses next-intl, with English as the currently supported language.

The form is a centered card with email, password, a password visibility toggle, and a sign-in button. It supports credential autofill and submission with Enter. The schema validates email format and a nonempty password without imposing new password rules at sign-in. Validation starts on submission and then runs when invalid fields are corrected.

Error presentation follows the project-wide [form convention](../../AGENTS.md#forms). Invalid credentials receive the same translated message regardless of whether the email or password is wrong; network failures receive a separate translated message. Repeated submission is disabled while a request is pending.

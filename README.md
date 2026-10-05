<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/26327420-f308-4e26-b0fb-fdc3c0498a03" />
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/93bfbfeb-af66-4007-9097-37748fea85d5" />
    <img width="340" alt="CodeFactory Logo" src="https://github.com/user-attachments/assets/dd75592b-0289-4382-998b-76904c0465b9">
  </picture>
</div>

# Studio

<div>
  <img src="https://img.shields.io/badge/Status-WIP-blue" alt="Status">
  <a href="https://github.com/fynnhaupt/codefactory-studio/actions/workflows/check.yaml">
    <img src="https://github.com/fynnhaupt/codefactory-studio/actions/workflows/check.yaml/badge.svg" alt="Check">
  </a>
  <a href="https://github.com/fynnhaupt/codefactory-studio/actions/workflows/deploy.yaml">
    <img src="https://github.com/fynnhaupt/codefactory-studio/actions/workflows/deploy.yaml/badge.svg" alt="Deploy">
  </a>
</div>

## What is CodeFactory Studio?

A self-hosted typescript platform for orchestrating automated software factories through a unified dashboard:

1. **Trigger on GitHub issues**: Listens to labeled GitHub issues to automatically trigger background coding jobs.
2. **Isolated Sandboxing**: Executes tasks inside isolated sandboxes using your custom `docker` or `docker-compose` containers.
3. **Issue to Pull Request**: Converts resolved issues into clean, test-verified Pull Requests ready for your review and merge.

CodeFactory Studio is completely **open-source** and **self-hosted** - designed to be fully customizable.

## Quick Start

### Generating Secrets

You can generate secrets with `openssl rand -base64 32` if you have `openssl` installed.

### Creating GitHub App

1. Go to `Settings > Developer Settings > GitHub Apps > New GitHub App`

2. Configure GitHub App Settings

- `GitHub App name`: `<your-github-app-name>`
- `Homepage URL`: `<your-public-url-here>`
- `Redirect URI`: `<your-public-url-here>/api/auth/callback/github`
- `Setup URL (optional)`: `<your-public-url-here>/api/github/callback/setup`
- `Webhook Active`: `Yes`
- `Webhook URL`: `<your-public-url-here>/api/github/callback/webhook`
- `Webhook Secret`: [See here](https://github.com/fynnhaupt/codefactory-studio#generating-secrets)

3. Configure GitHub App Permissions

- `Account permissions > Email addresses`: `Read-only`

4. Create GitHub App!

### Option 1: Docker Compose

**Prerequisites**: [Docker](https://www.docker.com/)

1. Create a `docker-compose.yaml` and fill out all missing variables:

```yaml
services:
  codefactory-studio:
    image: ghcr.io/fynnhaupt/codefactory-studio:latest
    restart: unless-stopped
    depends_on:
      - postgres
    ports:
      - 3000:3000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      DATABASE_URL: postgresql://codefactory-studio:<your-password-here>@postgres/codefactory-studio
      BETTER_AUTH_SECRET: <your-secret-here>
      BETTER_AUTH_URL: <your-public-url-here>
      GITHUB_APP_APPID: <your-github-app-appid>
      GITHUB_APP_PRIVATE_KEY: <your-github-app-private-key>
      GITHUB_APP_CLIENT_ID: <your-github-app-client-id>
      GITHUB_APP_CLIENT_SECRET: <your-github-app-client-secret>
      GITHUB_APP_WEBHOOK_SECRET: <your-github-app-webhook-secret>

  postgres:
    image: postgres:18-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: codefactory-studio
      POSTGRES_PASSWORD: <your-password-here>
      POSTGRES_DB: codefactory-studio
    volumes:
      - postgres_data:/var/lib/postgresql:Z

volumes:
  postgres_data:
```

2. Start **CodeFactory Studio**

```sh
docker compose up -d
```

### Option 2: Docker

**Prerequisites**: [Docker](https://www.docker.com/), [Postgres](https://www.postgresql.org/)

1. Start **CodeFactory Studio**

```sh
docker run -d \
  --name codefactory-studio \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e 'DATABASE_URL=postgresql://<your-username-here>:<your-password-here>@<your-postgres-host>:5432/<your-db-here>' \
  -e 'BETTER_AUTH_SECRET=<your-secret-here>' \
  -e 'BETTER_AUTH_URL=<your-public-url-here>' \
  -e 'GITHUB_APP_APPID: <your-github-app-appid>' \
  -e 'GITHUB_APP_CLIENT_ID: <your-github-app-client-id>' \
  -e 'GITHUB_APP_CLIENT_SECRET: <your-github-app-client-secret>' \
  -e 'GITHUB_APP_WEBHOOK_SECRET: <your-github-app-webhook-secret>' \
  ghcr.io/fynnhaupt/codefactory-studio:latest
```

## Development

### Setup GitHub App

1. Create GitHub App: [See Here](https://github.com/fynnhaupt/codefactory-studio#creating-github-app)

2. Add `GITHUB_APP_XXX` to `.env`

```dotenv
...
# GitHub App App ID
GITHUB_APP_APPID="your-github-app-appid"
# GitHub App Private Key
GITHUB_APP_PRIVATE_KEY="your-github-app-private-key"
# GitHub App Client ID
GITHUB_APP_CLIENT_ID="your-github-app-client-id"
# GitHub App Client Secret
GITHUB_APP_CLIENT_SECRET="your-github-app-client-secret"
# GitHub App Webhook Secret
GITHUB_APP_WEBHOOK_SECRET="your-github-app-webhook-secret"
```

### Proxy GitHub App Webhook

1. Get [Webhook Proxy Url](https://smee.io/new)

2. Add `GITHUB_APP_WEBHOOK_PROXY_URL` to `.env`

```dotenv
...
# GitHub App Webhook Proxy Url
GITHUB_APP_WEBHOOK_PROXY_URL="your-github-app-webhook-proxy-url"
```

3. Run `pnpm github:webhook:proxy`

### Option 1: Local

**Prerequisites**: [Docker](https://www.docker.com/), [Node.js](https://nodejs.org/), [pnpm](https://pnpm.io/)

See [.tool-versions](https://github.com/fynnhaupt/codefactory-studio/blob/main/.tool-versions) for the required Node.js and pnpm versions.

```sh
docker compose up -d
pnpm install
pnpm db:migrate:deploy
pnpm dev
```

### Option 2: Devcontainer

**Prerequisites**: Capability to run [devcontainer](https://containers.dev/)

**Depends on your environment.**

## License

Released under the [AGPL-3.0 License](https://github.com/fynnhaupt/codefactory-studio/blob/main/LICENSE)

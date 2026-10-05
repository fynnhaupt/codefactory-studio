<div align="center">
  <img width="340" alt="CodeFactory Logo" src="https://github.com/user-attachments/assets/a25ea27e-6494-424b-a5ce-6c95deddec6a" />
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

You can generate secrets with `openssl rand -base64 32` if you have `openssl` installed.

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
  ghcr.io/fynnhaupt/codefactory-studio:latest
```

## Development

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

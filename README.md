# vsds-ui-sample-app

A sample application for exploring and testing VSDS UI components, built with Vite, React, TypeScript, Tailwind CSS, and Radix UI.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9
- [direnv](https://direnv.net/)

## Private Registry Setup

`@mvb-fe/design-system` is published to a private Azure Artifacts npm registry. You must provide an authentication token before running `pnpm install` or `pnpm build`.

### 1. Create `.envrc`

Create a `.envrc` file at the project root (already in `.gitignore` — never commit this):

```sh
export AZURE_DEVOPS_NPM_TOKEN="<your-base64-encoded-pat>"
```

Replace `<your-base64-encoded-pat>` with a base64-encoded Azure DevOps PAT that has **Packaging (Read)** permission for the `mvb-fe` feed.

**How to get the token:**

1. Azure DevOps → User Settings → Personal Access Tokens
2. New Token → scope: **Packaging (Read)**
3. Copy the generated PAT, then base64-encode it:

```sh
echo -n "<PAT>" | base64
```

4. Paste the result as the value of `AZURE_DEVOPS_NPM_TOKEN` in `.envrc`.

### 2. Allow direnv

```sh
direnv allow
```

direnv will automatically export `AZURE_DEVOPS_NPM_TOKEN` whenever you `cd` into this directory. No manual assignment needed.

> **Shell hook required:** make sure your shell config includes the direnv hook.
> ```sh
> # ~/.zshrc or ~/.bashrc
> eval "$(direnv hook zsh)"   # or bash
> ```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The app will be available at **http://localhost:5173**.

## Other Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |

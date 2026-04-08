# Atom Workshop

A single tool for creating and managing all [atom](#atom) types.

## Contents

- [Introduction](#1-introduction)
- [Getting Started](#2-getting-started)
- [How It Works](#3-how-it-works)
- [Useful Links](#4-useful-links)
- [Terminology](#5-terminology)

## 1. Introduction

Atom Workshop is a Guardian editorial tool that provides a single place to create, edit, and publish
[atoms](#atom) of all types. It was built to consolidate atom management across The Guardian's editorial
workflow rather than requiring separate tools for each atom type.

**Users** are Guardian editorial staff who need to create and manage reusable interactive content
components for embedding in articles.

**Core features:**

- Create, edit, and delete atoms for a range of [atom types](#atom-types) including Q&A, Quick Guide,
  Profile, Timeline, Call To Action, Audio, Explainer, and Commons Division
- Publish atoms from [preview](#preview) to [live](#live) via Kinesis events
- View stats and embed codes for published atoms
- Link out to dedicated editors for atom types managed in external tools (Video, Quiz)
- Search and browse existing atoms

**Integrations:**

| Service | Purpose |
|---|---|
| [Composer](https://github.com/guardian/flexible-content) | Embeds atoms into articles |
| [Grid](https://github.com/guardian/grid) | Media/image picker |
| [Workflow](https://github.com/guardian/workflow-frontend) | Tracks atom editorial status |
| [Viewer](https://viewer.gutools.co.uk) | Previews atoms in a page context |
| [Targeting](https://targeting.gutools.co.uk) | Manages atom targeting rules |
| [Content API (CAPI)](https://github.com/guardian/content-api) | Reads published atom data |
| [Quizzes](https://github.com/guardian/quizzes) | External editor for Quiz atoms |
| [Video tool](https://github.com/guardian/media-atom-maker) | External editor for Video (media) atoms |

## 2. Getting Started

### Prerequisites

- **AWS CLI** — [installation guide](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
- **AWS credentials** for the `composer` and `capi` accounts, obtained from
  [Janus](https://janus.gutools.co.uk/multi-credentials?&permissionIds=capi-dev,composer-dev)
- **Node** — use [nvm](https://github.com/nvm-sh/nvm) to manage versions (`brew install nvm` if needed)
- **Java 11** — installed via [asdf](https://asdf-vm.com/):

  ```shell
  brew install asdf
  asdf plugin add java
  asdf install
  ```

### Setup

1. **Fetch config from S3:**

   ```shell
   ./fetch-config.sh
   ```

   If you see an error about requiring AWS Signature Version 4, run:

   ```shell
   aws configure set default.s3.signature_version s3v4
   ```

2. **Switch to the correct Node version:**

   ```shell
   nvm use
   ```

3. **Install dependencies and compile client-side assets:**

   ```shell
   ./scripts/setup.sh
   ```

4. **Run the app:**

   ```shell
   ./scripts/start.sh
   ```

   This starts both the webpack watcher (`yarn start`) and the Play server on port `9050`.

5. **Access the app** at https://atomworkshop.local.dev-gutools.co.uk (nginx must be running locally).

### Hot reloading

To run with hot reloading of client-side assets (webpack in watch mode alongside sbt):

```shell
./scripts/client-dev.sh
```

Add `--debug` to enable remote JVM debugging on port `5055`.

### Client-side only

To compile client-side assets once:

```shell
yarn build
```

To watch and recompile on change:

```shell
yarn start
```

### Tests and linting

```shell
yarn test   # Jest unit tests
yarn lint   # ESLint
```

### Deployment

The app is deployed via [Riff-Raff](https://riffraff.gutools.co.uk) using an autoscaling deployment in
the `flexible` stack, `eu-west-1` region. AMIs are managed by [Amigo](https://github.com/guardian/amigo)
using the `editorial-tools-jammy-java11` recipe.

## 3. How It Works

### Technology stack

| Layer | Technology |
|---|---|
| Backend | Scala 2.13, [Play Framework 3.0.x](https://www.playframework.com/documentation/3.0.x/Home) |
| Frontend | React, Redux, webpack, SCSS |
| Data store | AWS DynamoDB (separate preview and live tables per atom type) |
| Event streaming | AWS Kinesis |
| Authentication | [Pan-Domain Auth](https://github.com/guardian/pan-domain-authentication) |
| Authorisation | [Editorial Permissions Client](https://github.com/guardian/permissions) |
| Atom data model | [content-atom](https://github.com/guardian/content-atom) (Thrift/Scrooge) |
| Configuration | AWS SSM Parameter Store (via `simple-configuration-ssm`) |

### Architecture

The app consists of a Play backend serving a single-page React/Redux frontend:

```
Browser (React/Redux SPA)
        │
        │ HTTPS
        ▼
Play HTTP API (Scala)
        │
        ├──► DynamoDB   (preview table + live table per atom type)
        ├──► Kinesis    (preview stream + live stream for atom events)
        └──► CAPI       (Content API proxy for content suggestions)
```

On first load, the Play controller injects a `ClientConfig` JSON blob into the page, providing the
frontend with service URLs and the authenticated user's details.

### Key design concepts

**Preview / Live split** — Every [atom](#atom) exists in two separate DynamoDB tables: a
[preview](#preview) table used for drafts and editing, and a [live](#live) table for published content.
Publishing an atom copies it from preview to live and emits a Kinesis event so downstream consumers
(e.g. CAPI) can pick up the change.

**Atom types** — The supported atom types are defined in [`public/js/constants/atomData.js`](public/js/constants/atomData.js).
Some types (Video, Quiz) are considered *non-editable* in Workshop and link out to dedicated external
editors. Others (Q&A, Quick Guide, Profile, Timeline, CTA, Audio, Commons Division) are edited directly
within the tool. Explainer atoms are legacy and can be edited but not newly created.

**Thrift data model** — Atom data is serialised using the
[content-atom](https://github.com/guardian/content-atom) Thrift schema via Scrooge-generated Scala
classes. The [fezziwig](https://github.com/guardian/fezziwig/) library bridges between Thrift and Circe JSON for the API layer.

**Pan-Domain Auth** — All routes (except `/healthcheck`) require a valid Guardian Google OAuth
session cookie, validated via pan-domain-auth. The callback URL is `/oauthCallback`.

**Reindexing** — The app exposes endpoints for triggering full reindex jobs of preview and live atom
stores, which replay all atom events onto the Kinesis reindex streams.

### Project structure

```
app/
  config/       — App configuration (AWS credentials, service URLs, feature flags)
  controllers/  — Play controllers (main API, login, healthcheck, reindex, CAPI proxy)
  db/           — DynamoDB data store wrappers
  models/       — API response types, error models
  services/     — Kinesis publishers, editorial permissions
  util/         — Atom construction helpers, update logic, CORS
  views/        — Twirl HTML templates (single-page shell + auth error page)
conf/
  routes        — Play routes (REST API + client-side SPA catch-all)
public/js/
  actions/      — Redux action creators
  components/   — React components
  constants/    — Atom type definitions and prop types
  reducers/     — Redux reducers
  services/     — API client functions
  util/         — Shared frontend utilities
```

## 4. Useful Links

- [GitHub repository](https://github.com/guardian/atom-workshop)
- [Riff-Raff deployment history](https://riffraff.gutools.co.uk/deployment/history?projectName=editorial-tools%3Aatom-workshop)
- [content-atom Thrift schema](https://github.com/guardian/content-atom) — the data model used for all atoms
- [atom-manager-play](https://github.com/guardian/atom-maker?tab=readme-ov-file#atom-manager-play-lib-) — Play library providing DynamoDB data stores and reindex controllers
- [pan-domain-authentication](https://github.com/guardian/pan-domain-authentication) — shared Guardian SSO library
- [Composer (flexible-content)](https://github.com/guardian/flexible-content) — the article editor that embeds atoms
- [Media Atom Maker](https://github.com/guardian/media-atom-maker) — dedicated editor for Video atoms
- [Quizzes tool](https://github.com/guardian/ten-four_quiz-builder) — dedicated editor for Quiz atoms

## 5. Terminology

**Atom**
: A self-contained, reusable interactive content component that can be embedded in one or more Guardian
articles. Atoms are defined by the [content-atom](https://github.com/guardian/content-atom) Thrift schema
and have a type (e.g. quiz, guide, media) that determines their structure and behaviour.

**Atom types**
: The set of atom varieties supported by the platform. Those editable directly in Workshop are: Q&A,
Quick Guide, Profile, Timeline, Call To Action, Audio, Explainer (legacy), and Commons Division. Those
with dedicated external editors are Video (media) and Quiz.

**Preview**
: The draft state of an atom, stored in the preview DynamoDB table. Changes saved in the editor are
written here. Preview atoms are visible to editors but not yet publicly available through CAPI.

**Live**
: The published state of an atom, stored in the live DynamoDB table. An atom is promoted from preview to
live by the publish action, which also emits an event to the live Kinesis stream so CAPI can ingest the
update.

**Kinesis**
: AWS managed streaming service used to propagate atom create/update/delete/publish events to downstream
consumers such as CAPI. There are separate streams for preview and live, and for regular operations vs
reindex jobs.

**Pan-Domain Auth (Panda)**
: The Guardian's shared single-sign-on system, which uses a Google OAuth flow and a shared cookie across
`*.gutools.co.uk` and `*.dev-gutools.co.uk` subdomains.

**Snippet atom types**
: The subset of atom types (Q&A, Quick Guide, Profile, Timeline) that require editorial tagging before
they can be embedded in articles.

**Reindex**
: The process of replaying all atoms from DynamoDB onto the Kinesis reindex stream, allowing downstream
systems to rebuild their indexes from scratch.

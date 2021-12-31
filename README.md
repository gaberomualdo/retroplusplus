# Retro++

A simple and intuitive tool for team retrospectives.

Built by [Gabriel Romualdo](https://GabrielRomualdo.com).

## Get Started

```
yarn install && yarn dev
```

## Deployment

Deployed with Vercel.

## Backend & Database

Firebase realtime database. Right now this doesn't use the Firebase SDK for React, and instead loads the vanilla JS SDK into a global object on `window`.

Security rules (manually kept in sync with the Firebase console) are stored at `securityrules.json`. These are generally permissive to those who know a valid pin. A more secure system could be built with stricter client-side security rules with a backend in the future &mdash; right now this project has no server or serverless environment, hence the more lenient security rules.

# Minimal example of sending data with OpenTelemetry to Honeycomb using Typescript

Just a basic demonstration of something I _actually_ got working using OpenTelemetry (gRPC/HTTP).

**This project should give you an idea why I made [MikroTrace](https://github.com/mikaelvesavuori/mikrotrace).**

The project demonstrates the use of tracing: First making an overall span, then making child spans for calling the Star Wars API and then waiting for 250ms. Trivial, but enough the get the point across.

## Prerequisites

- You have a [Honeycomb](https://www.honeycomb.io) account
- You have a Honeycomb API key and a service name
- You have placed these in `src/config.ts`

## Instructions

Install with `npm install` or `yarn install`. Then run `npm start` or `yarn run` to start the project.

Toggle gRPC or HTTP implementation in `src/index.ts` under the provider import.

## References

- @jessitron's (Honeycomb) gist `Send Node.js instrumentation to Honeycomb`: https://gist.github.com/jessitron/6ef5c8e5e622faedc9937973b2a3cefe#file-package-json
- Discussion on `Error: @opentelemetry/api: Attempted duplicate registration of API: trace`: https://github.com/open-telemetry/opentelemetry-lambda/issues/237
- More on spans: https://opentelemetry.io/docs/instrumentation/js/instrumentation/
- Use SWAPI (The Star Wars API): https://swapi.dev

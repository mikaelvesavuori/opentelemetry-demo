import { trace, context } from '@opentelemetry/api';
import fetch from 'node-fetch';

import { provider } from './tracingHttp'; // There is also a gRPC version under './tracingGrpc'

const NAME = 'my-tracer';
const URL_BASE = 'https://swapi.dev/api/people/';

const tracer = trace.getTracer(NAME);

/**
 * Part 1 of our business part: Call an external API.
 */
async function getFromApi(context: any) {
  /**
   * Nested context that we use when calling the external API.
   */
  const span = tracer.startSpan('Get the name of a Star Wars character', undefined, context);
  /**
   * Call API.
   */
  const randomCharacterUrl = `${URL_BASE}` + Math.floor(Math.random() * (80 - 0 + 1) + 0);
  const response = await fetch(randomCharacterUrl)
    .then((res: any) => res.json())
    .then((res: any) => res.name);
  /**
   * Span attributes should be either the Honeycomb standards
   * or whatever they are named if you changed your dataset settings
   * to point to other fields.
   *
   * @see https://docs.honeycomb.io/getting-data-in/tracing/send-trace-data/
   */
  span.setAttribute('response', response);
  /**
   * End the API span.
   */
  span.end();
}

/**
 * Part 2 of our business logic: Just wait. Yep.
 */
async function wait(context: any) {
  /**
   * Let's add another arbitrary nested span in which we simply wait for a bit.
   */
  const span = tracer.startSpan('Wait', undefined, context);
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
  /**
   * End the wait span.
   */
  span.end();
}

/**
 * Trace your application by creating spans.
 */
async function app() {
  /**
   * This is the full parent span.
   */
  const totalSpan = tracer.startSpan('Do several things');
  /**
   * We will get the current parent context and pass it to the other spans...
   */
  const ctx = trace.setSpan(context.active(), totalSpan);
  /**
   * Get data from an API.
   */
  await getFromApi(ctx);
  /**
   * Wait for a bit.
   */
  await wait(ctx);
  /**
   * Finally, end the parent span.
   */
  totalSpan.end();
}

async function main() {
  while (true) await app();
}

main();

process.on('SIGINT', async () => {
  console.log('Flushing telemetry');
  await provider.activeSpanProcessor.forceFlush();
  console.log('Flushed');
  process.exit();
});

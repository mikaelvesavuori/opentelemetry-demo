import { diag, trace, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'; // proto http grpc
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { config } from './config';

const { API_KEY, SERVICE_NAME } = config;
process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'https://api.honeycomb.io';
process.env.OTEL_EXPORTER_OTLP_HEADERS = `x-honeycomb-team=${API_KEY},x-honeycomb-dataset=${SERVICE_NAME}`;

// See more logs
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

export const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME
  })
});

// This will set up the trace exporter
provider.addSpanProcessor(
  new BatchSpanProcessor(new OTLPTraceExporter(), {
    scheduledDelayMillis: 500,
    maxQueueSize: 16000,
    maxExportBatchSize: 1000
  })
);

// This will make you see the spans in the console
provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));

provider.register();

// Set up some default HTTP instrumentation
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [new HttpInstrumentation()]
});

// Hook up your tracer globally
trace.setGlobalTracerProvider(provider);

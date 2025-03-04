const { NodeSDK } = require('@opentelemetry/sdk-node'); 
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SEMRES_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', 
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRES_SERVICE_NAME]: 'nodejs-app',
  }),
  traceExporter: exporter,
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

sdk.start();
console.log('Tracing initialized.');


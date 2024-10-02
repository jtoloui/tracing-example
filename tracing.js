const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const process = require('process');
require('dotenv').config();

// Environment Variables
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

// Exporters
let exporter;

if (isProduction) {
	// Datadog OTLP Exporter
	exporter = new OTLPTraceExporter({
		url: process.env.DATADOG_AGENT_URL, // Datadog agent OTLP endpoint
		headers: {
			'DD-API-KEY': process.env.DD_API_KEY, // Optional: Datadog API key for OTLP if required
		},
	});
	console.log('Using Datadog OTLP Exporter');
} else {
	// Jaeger OTLP Exporter for Development
	exporter = new OTLPTraceExporter({
		url: process.env.JAEGER_URL || 'http://localhost:4318/v1/traces', // Jaeger OTLP endpoint
	});
	console.log('Using Jaeger OTLP Exporter');
}

// Node SDK setup
const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [getNodeAutoInstrumentations({
		'@opentelemetry/instrumentation-express': {
			ignoreLayersType: ['request_handler', 'middleware'],
			ignoreLayers: [(name, type) => {
				console.log(name === '/ping');

				return name === '/ping'; // Ignore /ping route
			}],
		},
		'@opentelemetry/instrumentation-http': {
			ignoreIncomingRequestHook: (req) => {
				return req.url === '/ping'; // Ignore /ping route
			},
		}
	})],
	serviceName: 'express-app',

});

// Start the SDK (which initializes tracing)
sdk.start()

// Ensure tracing is shut down properly on process exit
process.on('SIGTERM', () => {
	sdk.shutdown()
		.then(() => console.log('Tracing shut down'))
		.catch((error) => console.log('Error shutting down tracing', error))
		.finally(() => process.exit(0));
});

require('./tracing'); // Initialize tracing

const express = require('express');
const { trace, SpanStatusCode } = require('@opentelemetry/api');

const app = express();
const port = 3000;
const tracer = trace.getTracer('my-express-app');

// Simple route to test
app.get('/', (req, res) => {
	res.send('Hello, OpenTelemetry with Express.js!');
});

app.get('/ping', (req, res) => {
	res.send('pong');
})

app.get('/error', (req, res) => {


	// Manually create a span for this route
	const span = tracer.startSpan('error-span1');

	try {
		// Simulate some code that throws an error
		throw new Error('Something went wrong!');
	} catch (error) {
		// Mark the span as having an error
		span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });

		// Optionally record the exception details
		span.recordException(error);

		// Add more attributes (optional)
		// span.setAttribute('error.type', error.name);
		// span.setAttribute('error.message', error.message);
		// span.setAttribute('error.stack', error.stack);

		res.status(500).send('An error occurred11');
	} finally {
		// End the span whether an error occurred or not
		span.end();
	}
});

// app.use((err, req, res, next) => {
// 	const span = tracer.startSpan('error-handler');
// 	console.error(err.stack);
// 	span.recordException(err);
// 	span.setAttributes({
// 		'error.message': err.message,
// 		'error.stack': err.stack,
// 		'error': true
// 	});
// 	span.setStatus(SpanStatusCode.ERROR);
// 	res.status(500).send('Something broke!');
// 	span.end();
// });

// Start the server
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

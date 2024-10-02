# Tracing example swapping between Jaeger (Development environment) and DataDog (Production environment)

This example demonstrates how to swap between Jaeger and DataDog tracing in a Node.js express application.

## Prerequisites
```
# Install Node.js version 20
nvm use
```

## Setup
```
# Install dependencies
npm install
```

## Run
```
# Start the application
npm start
```

## What to configure in dd-agent
- enable OTEL tracing in the [configuration file](https://docs.datadoghq.com/opentelemetry/interoperability/otlp_ingest_in_the_agent/?tab=host)
  

## How tracing works and custom spans

- This application no longer imports dd-trace and instead manages instrumentation through the OpenTelemetry API as well as instrumentation configuration.
  

### Extra notes
- Controls instrumentation through [ENV variables](https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/metapackages/auto-instrumentations-node/README.md)

# 🚀 MCP Report Postgres

A Model Context Protocol (MCP) service for querying PostgreSQL databases and generating reports for the Videri Digital Signage platform.

## 📋 Overview

This service provides a PostgreSQL database interface for Videri Digital Signage platform through the Model Context Protocol. It enables running SQL queries directly against the Videri database and exporting results to CSV files.

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-report-postgres.git
cd

# Install dependencies
npm install

# Build the project
npm run build
```

## ⚙️ Configuration

Create a `.env` file based on the sample provided:

```bash
cp .sample.env .env
```

And configure the following environment variables:

```
APP_PORT=3000
MODE=sse # or stdio
API_KEYS=your_api_key1,your_api_key2 # Comma-separated list of API
```

## 🏃‍♀️ Running the Service

```bash
# Development mode
npm run dev
# or
npm run start:dev

# Production mode
npm start
```

### SSE Connection
You have to pass mode in environment variable to connect to the SSE server.
```
MODE="sse"
```
And also you have to pass comma separated list of API keys that are allowed to access the SSE server.
```
API_KEYS="key1,key2,key3"
```

When making requests set this header: `x-api-key` and pass one of the API keys you set in the environment variable.

## 🧰 Available Tools

### 1. `weather`
- **Description**: Fetches weather data from the Open Meteo API.
- **Input Schema**:
```json
{
  "latitude": "number",
  "longitude": "number",
  "start_date": "string",
  "end_date": "string",
  "timezone": "string"
}
```
- **Output Schema**: Returns weather data in JSON format.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


# 🚀 MCP Template

[![CI](https://github.com/pshaddel/mcp-template/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/pshaddel/mcp-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/github/pshaddel/mcp-template/graph/badge.svg?token=5DNFYP8N97)](https://codecov.io/github/pshaddel/mcp-template)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

<meta name="google-site-verification" content="TH8G_S7VXcPStsxDW5p5uLhvMOUW_onxvvz87LLF4Ck" />

A Model Context Protocol (MCP) server template for Node.js with TypeScript support.

## 📋 Overview

This is a comprehensive MCP server template that provides a robust foundation for building Model Context Protocol servers. It supports multiple transport modes: stdio, SSE (Server-Sent Events), and HTTP streams, making it suitable for various integration scenarios. The template includes authentication, logging, and a sample weather tool to demonstrate the MCP tool implementation pattern.

## � Prerequisites

- Node.js 18+
- npm or pnpm
- TypeScript knowledge for customization

## �🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/pshaddel/mcp-template.git
cd mcp-template

# Install dependencies
npm install
# or
pnpm install

# Build the project
npm run build
```

## ⚙️ Configuration

Create a `.env` file based on the sample provided:

```bash
cp .sample.env .env
```

Configure the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MODE` | Transport mode: `stdio`, `sse`, or `http-streams` | `stdio` | Yes |
| `API_KEYS` | Comma-separated list of allowed API keys (SSE/HTTP streams mode only) | - | No (required for SSE/HTTP streams) |
| `APP_PORT` | Port for SSE/HTTP streams server | `3000` | No |

### Example Configuration

**For stdio mode (Claude Desktop):**
```env
MODE=stdio
```

**For SSE mode (HTTP server):**
```env
MODE=sse
API_KEYS=your_api_key1,your_api_key2
APP_PORT=3000
```

**For HTTP streams mode (HTTP server with streaming):**
```env
MODE=http-streams
API_KEYS=your_api_key1,your_api_key2
APP_PORT=3000
```

## 🏃‍♀️ Running the Service

### Development Mode
```bash
npm run dev
# or
npm run start:dev
# or with pnpm
pnpm dev
```

### Production Mode
```bash
npm start
# or with pnpm
pnpm start
```

## � MCP Inspector

The MCP Inspector is a powerful debugging tool that provides a web interface to test and interact with your MCP server tools during development.

### How to run

```bash
npx @modelcontextprotocol/inspector
```

This will start the inspector and open it in your browser (typically at `http://localhost:5173`).

### Configuration

The inspector supports different transport modes depending on how your MCP server is running:

#### SSE Configuration

When running your server in SSE mode:

1. **URL:** `http://localhost:3000/sse` (or your configured port)
2. **Headers:** Add the following header for authentication:
   - **Header Name:** `x-api-key`
   - **Header Value:** Your API key from the `.env` file

<img width="980" height="531" alt="Screenshot 2025-08-21 at 20 57 46" src="https://github.com/user-attachments/assets/f790d1d0-0386-41e1-9a19-b980d28d23e1" />

#### HTTP Streams Configuration

When running your server in HTTP streams mode:

1. **URL:** `http://localhost:3000/mcp` (or your configured port)
2. **Headers:** Add the following header for authentication:
   - **Header Name:** `x-api-key`
   - **Header Value:** Your API key from the `.env` file
<img width="980" height="531" alt="Screenshot 2025-08-21 at 20 57 26" src="https://github.com/user-attachments/assets/c611a378-d4c8-4600-9c02-15bb350eea49" />

### Usage Tips

- Start your MCP server first in either SSE or HTTP streams mode
- The inspector will automatically detect available tools and display their schemas
- You can test tools interactively and see real-time responses
- Use the inspector to validate your tool implementations before integrating with other clients

## �🔌 Integration

### Claude Desktop Integration

1. Build the project:
```bash
npm run build
```

2. Add the following configuration to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
    "mcpServers": {
        "mcp-template": {
            "command": "node",
            "args": [
                "--env-file=/path/to/your/project/.env",
                "/path/to/your/project/build/main.js"
            ]
        }
    }
}
```
3.Then restart Claude Desktop. and you should see the MCP server listed in the settings.

![ScreenRecording2025-07-30at15 24 49-ezgif com-crop](https://github.com/user-attachments/assets/1e87c54d-b16a-4933-a57f-f4c9744e6de4)

### n8n Integration
0. Run the application in `sse` or `http-streams` mode. If running locally, use `npm run dev` or `npm start`.
   - For SSE mode: server will be available at `http://localhost:3000/sse`
   - For HTTP streams mode: server will be available at `http://localhost:3000/mcp`

   If you are running n8n in a docker container, you cannot use `http://localhost:3000` as the n8n container cannot access the host's localhost. Instead, you can use `http://host.docker.internal:3000` to access the host's services from within the n8n container, or you can run the n8n container with the `--network="host"` option to share the host's network stack.

1. Run the n8n instance, if locally, use the following command:
```bash
docker run -it --rm \
    -p 5678:5678 \
    -v ~/.n8n:/home/node/.n8n \
    n8nio/n8n
```
2. Open n8n in your browser at `http://localhost:5678`.

3. Create a new workflow and add an AI Agent node.

4. In Tools section, add a <b>MCP Client Tool</b> node.

5. Configure the MCP Client Tool node with the following settings:
    - **Server URL:**
      - For SSE mode: `http://host.docker.internal:3000/sse`
      - For HTTP streams mode: `http://host.docker.internal:3000/mcp`
    - **API Key:** Add a custom header `x-api-key` with your API key from the `.env` file.

The Tools Should be available now.

![n8n-integration](https://github.com/user-attachments/assets/e78bdc37-0635-446e-be5b-b84855577f67)

### HTTP Streams Integration

When running in HTTP streams mode, the server provides streamable HTTP endpoints for MCP communication with session management:

**Base URL:** `http://localhost:3000` (or your configured port)

**Endpoints:**
- `POST /mcp` - Initialize session or send MCP messages
- `GET /mcp` - Retrieve server-to-client notifications (requires session ID)
- `DELETE /mcp` - Terminate MCP session
- `GET /health` - Health check endpoint

**Session Management:**
HTTP streams mode uses session-based communication. Include the `mcp-session-id` header in requests after initialization:

```bash
# Initialize a new session
curl -X POST \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test-client","version":"1.0.0"}}}' \
  http://localhost:3000/mcp

# Use the returned session ID in subsequent requests
curl -X POST \
  -H "x-api-key: your_api_key" \
  -H "mcp-session-id: your-session-id" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  http://localhost:3000/mcp
```

**Authentication:**
Set the `x-api-key` header with one of your configured API keys for all requests.


### VS Code Integration

1. Enable MCP support in VS Code in settings.

<img width="1273" height="392" alt="Screenshot 2025-07-30 at 15 31 18" src="https://github.com/user-attachments/assets/7cb3ef50-329a-49d2-aaa3-3440fd9600d2" />

2. Use it via VS Code by adding the following to your `.vscode/mcp.json` file:

```json
{
    "servers": {
        "mcp-template": {
            "type": "stdio",
            "command": "node",
            "args": [
                "--env-file=/path/to/your/project/.env",
                "/path/to/your/project/build/main.js"
            ]
        }
    },
    "inputs": []
}
```

3. Start using it in VS Code by running the MCP commands in Copilot Chat(In Agent mode).

### SSE Server Integration

When running in SSE mode, the server provides HTTP endpoints for MCP communication:

**Base URL:** `http://localhost:3000` (or your configured port)

**Endpoints:**
- `GET /sse` - Establish SSE connection
- `POST /messages` - Send MCP messages
- `GET /health` - Health check endpoint

**Authentication:**
Set the `x-api-key` header with one of your configured API keys:

```bash
curl -H "x-api-key: your_api_key" http://localhost:3000/sse
```

## 🧰 Available Tools

### 1. `weather`
Fetches weather data from the Open Meteo API.

**Input Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `latitude` | string | Latitude of the location | `"47.8095"` |
| `longitude` | string | Longitude of the location | `"13.0550"` |
| `start_date` | string | Start date (YYYY-MM-DD) | `"2025-07-25"` |
| `end_date` | string | End date (YYYY-MM-DD) | `"2025-07-25"` |
| `timezone` | enum | Timezone | `"Europe/London"` |

**Supported Timezones:**
- `Europe/London`
- `America/New_York`
- `Asia/Tokyo`

**Example Usage:**
```json
{
  "latitude": "47.8095",
  "longitude": "13.0550",
  "start_date": "2025-07-25",
  "end_date": "2025-07-25",
  "timezone": "Europe/London"
}
```

## 🛠️ Development

### Project Structure
```
src/
├── main.ts              # Main server entry point
├── tools/               # MCP tools directory
│   ├── tool.interface.ts # Tool interface definition
│   └── weather.ts       # Weather tool implementation
└── tests/               # Test files
    └── weather.test.ts  # Weather tool tests
```

### Adding New Tools

1. Create a new tool file in `src/tools/`:

```typescript
import { z } from 'zod';
import { Tool } from './tool.interface.js';

export const myTool: Tool = {
    tool_name: 'my_tool',
    description: 'Description of what your tool does',
    inputSchema: {
        // Define your input schema using zod validators
        param1: z.string().describe('Parameter description'),
    },
    function: async (args) => {
        // Implement your tool logic here
        return {
            content: [{
                type: 'text',
                text: 'Tool response'
            }]
        };
    }
};
```

2. Register the tool in `src/main.ts`:

```typescript
import { myTool } from './tools/my-tool.js';

// Add this line after the existing tool registration
mcpServer.registerTool(myTool.tool_name, {
    description: myTool.description,
    inputSchema: myTool.inputSchema,
}, myTool.function);
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Run in development mode with hot reload |
| `npm run start:dev` | Alternative development command |
| `npm start` | Run the built server |
| `npm run test:coverage` | Run tests with coverage report |

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build the Docker image
docker build -t mcp-template .

# Run the container
docker run -p 3000:3000 --env-file .env mcp-template
```

## � Testing

Run tests to ensure everything works correctly:

```bash
npm test              # Run tests
npm run test:coverage # Run tests with coverage
# or
pnpm test
pnpm run test:coverage
```

## 🔧 Troubleshooting

### Common Issues

### Common Issues

**"Transport not found" error in SSE/HTTP streams mode:**
- Ensure the SSE connection is established before sending messages (SSE mode)
- Check that the sessionId is properly passed in requests (HTTP streams mode)
- Verify the correct endpoint is being used (`/sse` for SSE, `/mcp` for HTTP streams)

**Session management issues (HTTP streams mode):**
- Ensure you initialize a session with the `initialize` method before other requests
- Include the `mcp-session-id` header in all requests after initialization
- Check that the session hasn't expired or been terminated

**Permission errors:**
- Verify the API key is correctly set in headers
- Check that the API key exists in your `API_KEYS` environment variable

**Build errors:**
- Run `npm run build` to ensure TypeScript compilation succeeds
- Check that all dependencies are installed

### Debug Mode

Enable detailed logging by setting the log level:

```typescript
// In main.ts, modify the capabilities
capabilities: {
    logging: {
        level: 'debug', // Change from 'info' to 'debug'
        format: 'json',
        destination: 'stdout',
    }
}
```

## 📚 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop Integration Guide](https://docs.anthropic.com/claude/docs)

## �🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com/) for the Model Context Protocol
- [Open Meteo](https://open-meteo.com/) for the weather API used in the example tool


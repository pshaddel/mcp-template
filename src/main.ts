import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { weatherTool } from "./tools/weather.js";

const args = process.argv.slice(2);
const modeArg = args.find((arg) => arg.startsWith("--mode="));
if (modeArg) {
	process.env.MODE = modeArg.split("=")[1];
}

const mcpServer = new McpServer(
	{
		name: "MCP Template",
		version: "1.0.0",
		description: "A Model Context Protocol (MCP) server template for Node.js",
		title: "MCP Template Server",
	},
	{
		instructions:
			"This is a Model Context Protocol (MCP) server template for Node.js. It provides a basic setup for handling requests and responses using the MCP protocol. You can extend it with your own tools and functionalities.",
		capabilities: {
			logging: {
				level: "info",
				format: "json",
				destination: "stdout",
			},
		},
	},
);

mcpServer.registerTool(
	weatherTool.tool_name,
	{
		description: weatherTool.description,
		inputSchema: weatherTool.inputSchema,
	},
	weatherTool.function,
);

async function main() {
	const modeResult = z
		.enum(["stdio", "sse"])
		.safeParse(process.env.MODE || "stdio");

	if (!modeResult.success) {
		console.error(
			"Invalid MODE ...environment variable. Expected 'stdio' or 'sse'.",
		);
		process.exit(1);
	}

	const mode = modeResult.data;

	if (mode === "stdio") {
		const transport = new StdioServerTransport();
		await mcpServer.connect(transport);
	} else {
		const app = express();
		const port = process.env.APP_PORT
			? Number.parseInt(process.env.APP_PORT)
			: 3000;

		if (!process.env.API_KEYS) {
			console.error(
				"API_KEYS environment variable is not set. Please set it to a comma-separated list of allowed API keys.",
			);
			process.exit(1);
		}

		const allowed_api_keys = process.env.API_KEYS
			? process.env.API_KEYS.split(",")
			: [];

		const transportMap = new Map<string, SSEServerTransport>();

		app.get("/health", (_req, res) => {
			res.status(200).json({ status: "ok" });
		});

		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		app.use((req, res, next) => {
			const apiKey =
				(req.headers["x-api-key"] as string) || (req.query.apiKey as string);
			if (!apiKey || !allowed_api_keys.includes(apiKey)) {
				return res
					.status(403)
					.json({ error: "Forbidden: Invalid or missing API key" });
			}
			next();
		});

		app.use((req, _res, next) => {
			console.info(
				`${req.method} ${req.url}  ${req.body ? JSON.stringify(req.body) : ""}`,
			);
			next();
		});

		app.get("/sse", async (req, res) => {
			const transport = new SSEServerTransport("/messages", res);
			transportMap.set(transport.sessionId, transport);
			console.info(
				`New SSE connection established with sessionId: \x1b[36m${transport.sessionId}\x1b[0m, ip: \x1b[32m${req.ip}\x1b[0m`,
			);
			await mcpServer.connect(transport);
		});

		app.post("/messages", async (req, res) => {
			const sessionId = req.query.sessionId as string;
			if (!sessionId) {
				console.error("Message received without sessionId");
				res.status(400).json({ error: "sessionId is required" });
				return;
			}

			const transport = transportMap.get(sessionId);

			console.log(
				`message sessionId: \x1b[36m${sessionId}\x1b[0m - transport: \x1b[33m${!!transport ? "exists" : "none"}\x1b[0m`,
				req.body,
			);
			if (transport) {
				await transport.handlePostMessage(req, res, req.body);
			} else {
				// create a new transport if not found
				const newTransport = new SSEServerTransport("/messages", res);
				transportMap.set(newTransport.sessionId, newTransport);

				console.error(`No transport found for sessionId: ${sessionId}`);
				res.status(404).json({ error: "Transport not found for sessionId" });
			}
		});

		app.use((_req, res) => {
			res.status(404).json({ error: "Not Found" });
		});

		app.listen(port, () => {
			console.info("Server is running on port", port);
			console.info(
				`SSE Endpoint: \x1b[36mhttp://localhost:${port}/sse\x1b[0m with the header \x1b[33m"X-API-Key"\x1b[0m`,
			);
		});
	}
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});

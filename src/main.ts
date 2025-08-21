import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { z } from "zod";
import { weatherTool } from "./tools/weather.js";
import { httpStreamTransportFactory } from "./transports/http-streams.js";
import { SSETransportFactory } from "./transports/sse.js";

const args = process.argv.slice(2);
const modeArg = args.find((arg) => arg.startsWith("--mode="));
if (modeArg) {
	process.env.MODE = modeArg.split("=")[1];
}

export const mcpServer = new McpServer(
	{
		name: "MCP Template",
		version: "1.0.0",
		description: "A Model Context Protocol (MCP) server template for Node.js",
		title: "MCP Template Server",
	},
	{
		instructions:
			"This is a Model Context Protocol (MCP) server template for Node.js. It provides a basic setup for handling requests and responses using the MCP protocol. You can extend it with your own tools and functionalities.",
		// capabilities: {
		// 	logging: {
		// 		level: "info",
		// 		format: "json",
		// 		destination: "console",
		// 	},
		// },
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
		.enum(["stdio", "sse", "http-streams"])
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

		app.use("/health", (_req, res) => {
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

		if (mode === "sse") {
			const { sseRouter } = SSETransportFactory(mcpServer);
			app.use(sseRouter);
		}

		if (mode === "http-streams") {
			const { httpStreamRouter } = httpStreamTransportFactory(mcpServer);
			app.use(httpStreamRouter);
		}

		app.use((_req, res) => {
			console.log(`404 Not Found: ${_req.method} ${_req.url}`);
			res.status(404).json({ error: "Not Found" });
		});

		app.listen(port, () => {
			// check if the port is already in use
			// biome-ignore lint/suspicious/noExplicitAny: off
			app.on("error", (err: any) => {
				if (err.code === "EADDRINUSE") {
					console.error(
						`Port ${port} is already in use. Please use a different port.`,
					);
					process.exit(1);
				} else {
					console.error("Error starting server:", err);
					process.exit(1);
				}
			});
			console.info("Server is running on port", port);
			if (mode === "sse")
				console.info(
					`SSE Endpoint: \x1b[36mhttp://localhost:${port}/sse\x1b[0m with the header \x1b[33m"X-API-Key"\x1b[0m`,
				);
			if (mode === "http-streams")
				console.info(
					`HTTP Stream Endpoint: \x1b[36mhttp://localhost:${port}/mcp\x1b[0m with the header \x1b[33m"X-API-Key"\x1b[0m`,
				);
		});
	}
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});

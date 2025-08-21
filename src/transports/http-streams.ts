import { randomUUID } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express from "express";

export function httpStreamTransportFactory(mcpServer: McpServer) {
	const router = express.Router();
	const transportMap: { [sessionId: string]: StreamableHTTPServerTransport } =
		{};
	router.post("/mcp", async (req, res) => {
		// Check for existing session ID
		const sessionId = req.headers["mcp-session-id"] as string | undefined;
		let transport: StreamableHTTPServerTransport;

		if (sessionId && transportMap[sessionId]) {
			// Reuse existing transport
			transport = transportMap[sessionId];
		} else if (!sessionId && isInitializeRequest(req.body)) {
			// New initialization request
			transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID(),
				onsessioninitialized: (sessionId) => {
					// Store the transport by session ID
					transportMap[sessionId] = transport;
				},
				// DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
				// locally, make sure to set:
				// enableDnsRebindingProtection: true,
				// allowedHosts: ['127.0.0.1'],
			});

			// Clean up transport when closed
			transport.onclose = () => {
				if (transport.sessionId) {
					delete transportMap[transport.sessionId];
				}
			};
			const server = mcpServer;

			// ... set up server resources, tools, and prompts ...

			// Connect to the MCP server
			await server.connect(transport);
		} else {
			// Invalid request
			res.status(400).json({
				jsonrpc: "2.0",
				error: {
					code: -32000,
					message: "Bad Request: No valid session ID provided",
				},
				id: null,
			});
			return;
		}

		// Handle the request
		await transport.handleRequest(req, res, req.body);
	});

	// Reusable handler for GET and DELETE requests
	const handleSessionRequest = async (
		req: express.Request,
		res: express.Response,
	) => {
		const sessionId = req.headers["mcp-session-id"] as string | undefined;
		if (!sessionId || !transportMap[sessionId]) {
			res.status(400).send("Invalid or missing session ID");
			return;
		}

		const transport = transportMap[sessionId];
		// if it is set
		if (req?.body?.method === "logging/setLevel") {
			console.log("Setting logging level:", req.body.params.level);
			res.status(200).json({});
			// await transport.handleRequest(req, res, req.body);
			return;
		}
		await transport.handleRequest(req, res);
	};

	// Handle GET requests for server-to-client notifications via SSE
	router.get("/mcp", handleSessionRequest);

	// Handle DELETE requests for session termination
	router.delete("/mcp", handleSessionRequest);

	return {
		httpStreamTransportMap: transportMap,
		httpStreamRouter: router,
	};
}

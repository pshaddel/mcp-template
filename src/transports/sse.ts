import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

export function SSETransportFactory(mcpServer: McpServer) {
	const transportMap = new Map<string, SSEServerTransport>();
	const sseRouter = express.Router();
	sseRouter.get("/sse", async (req, res) => {
		const transport = new SSEServerTransport("/messages", res);
		transportMap.set(transport.sessionId, transport);
		console.info(
			`New SSE connection established with sessionId: \x1b[36m${transport.sessionId}\x1b[0m, ip: \x1b[32m${req.ip}\x1b[0m`,
		);
		await mcpServer.connect(transport);
	});
	sseRouter.post("/messages", async (req, res) => {
		const sessionId = req.query.sessionId as string;
		if (!sessionId) {
			console.error("Message received without sessionId");
			res.status(400).json({ error: "sessionId is required" });
			return;
		}

		const transport = transportMap.get(sessionId);

		console.log(
			`message sessionId: \x1b[36m${sessionId}\x1b[0m - transport: \x1b[33m${transport ? "exists" : "none"}\x1b[0m`,
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

	return {
		sseTransportMap: transportMap,
		sseRouter: sseRouter,
	};
}

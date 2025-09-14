import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "graphql-mcp-bridge";
import { queryRunner } from "./run-graphql-query.js";

export async function regsiterSchemaTools(
	parsedSchema: Tool[],
    mcpServer: McpServer,
) {
	for (const tool of parsedSchema) {
		mcpServer.registerTool(
			tool.name,
			{
				description: tool.description || "No description provided",
				inputSchema: {
					input: tool.inputSchema,
					output: tool.outputSchema,
				},
			},
			async ({ input, output }) => {
				const res = await tool.execution(input, output);
				const { data, error } = await queryRunner(res.query, res.variables);
				if (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error from GraphQL API: ${JSON.stringify(
									error,
									null,
									2,
								)}`,
							},
						],
					};
				}
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(data, null, 2),
						},
					],
				};
			},
		);
	}
    if (process.env.MODE !== "stdio") {
        console.info(
            "Registering Tools:",
            parsedSchema.map((s) => s.name),
        );
    }
}

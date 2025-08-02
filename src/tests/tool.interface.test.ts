import assert from "node:assert";
import { describe, it } from "node:test";
import type { Tool } from "../tools/tool.interface.js";

describe("Tool Interface Tests", () => {
	it("should define a valid tool interface", () => {
		const mockTool: Tool = {
			tool_name: "test_tool",
			description: "A test tool",
			inputSchema: {},
			function: () => ({ content: [{ type: "text", text: "test" }] }),
		};

		assert.strictEqual(typeof mockTool.tool_name, "string");
		assert.strictEqual(typeof mockTool.description, "string");
		assert.strictEqual(typeof mockTool.inputSchema, "object");
		assert.strictEqual(typeof mockTool.function, "function");
	});

	it("should allow optional outputSchema", () => {
		const toolWithOutput: Tool = {
			tool_name: "test_tool",
			description: "A test tool",
			inputSchema: {},
			outputSchema: {},
			function: () => ({ content: [{ type: "text", text: "test" }] }),
		};

		assert.ok(toolWithOutput.outputSchema);
	});
});
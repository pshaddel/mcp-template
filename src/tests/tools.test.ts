import assert from "node:assert";
import { describe, it } from "node:test";
import { weatherTool } from "../tools/weather.js";

describe("Tools Integration Tests", () => {
	const tools = [weatherTool];

	it("should have at least one tool registered", () => {
		assert.ok(tools.length > 0);
	});

	it("should have unique tool names", () => {
		const names = tools.map(tool => tool.tool_name);
		const uniqueNames = new Set(names);
		assert.strictEqual(names.length, uniqueNames.size);
	});

	it("should have valid tool structure for all tools", () => {
		for (const tool of tools) {
			assert.ok(typeof tool.tool_name === "string" && tool.tool_name.length > 0);
			assert.ok(typeof tool.description === "string" && tool.description.length > 0);
			assert.ok(typeof tool.inputSchema === "object");
			assert.ok(typeof tool.function === "function");
		}
	});

	it("should return proper response format from all tools", async () => {
		for (const tool of tools) {
			const response = await tool.function({});
			assert.ok(response.content);
			assert.ok(Array.isArray(response.content));
			assert.ok(response.content.length > 0);
			assert.ok(response.content[0].type);
			assert.ok(response.content[0].text);
		}
	});
});
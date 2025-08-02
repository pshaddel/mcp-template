import assert from "node:assert";
import { describe, it } from "node:test";
import { weatherTool } from "../tools/weather.js";

describe("Weather Tool Tests", () => {
	it("should have correct tool metadata", () => {
		assert.strictEqual(weatherTool.tool_name, "weather");
		assert.ok(weatherTool.description.length > 0);
		assert.ok(weatherTool.inputSchema);
	});

	it("should validate input schema structure", () => {
		const schema = weatherTool.inputSchema;
		assert.ok(schema.latitude);
		assert.ok(schema.longitude);
		assert.ok(schema.start_date);
		assert.ok(schema.end_date);
		assert.ok(schema.timezone);
	});

	it("should handle missing parameters", async () => {
		const response = await weatherTool.function({});
		assert.ok(
			response.content[0].text.includes("Failed to fetch weather data"),
		);
	});

	it("should handle invalid coordinates", async () => {
		const response = await weatherTool.function({
			latitude: "invalid",
			longitude: "invalid",
			start_date: "2025-01-01",
			end_date: "2025-01-01",
		});
		assert.ok(
			response.content[0].text.includes("Failed to fetch weather data"),
		);
	});

	it("should fetch weather data with valid parameters", async () => {
		// Mock successful fetch
		const originalFetch = global.fetch;
		global.fetch = async () =>
			({
				ok: true,
				json: async () => ({
					daily: {
						temperature_2m_max: [20.5],
						temperature_2m_min: [10.2],
						precipitation_sum: [0.0],
					},
				}),
			}) as Response;

		const response = await weatherTool.function({
			latitude: "47.8095",
			longitude: "13.0550",
			start_date: "2025-01-01",
			end_date: "2025-01-01",
			timezone: "Europe/London",
		});

		const data = JSON.parse(response.content[0].text);
		assert.ok(data.daily);
		assert.ok(data.daily.temperature_2m_max);
		assert.ok(data.daily.temperature_2m_min);
		assert.ok(data.daily.precipitation_sum);

		// Restore original fetch
		global.fetch = originalFetch;
	});

	it("should handle API response errors", async () => {
		// Mock failed fetch
		const originalFetch = global.fetch;
		global.fetch = async () =>
			({
				ok: false,
				statusText: "Not Found",
			}) as Response;

		const response = await weatherTool.function({
			latitude: "47.8095",
			longitude: "13.0550",
			start_date: "2025-01-01",
			end_date: "2025-01-01",
		});

		assert.ok(
			response.content[0].text.includes(
				"Error fetching weather data: Not Found",
			),
		);

		// Restore original fetch
		global.fetch = originalFetch;
	});

	it("should use default timezone when not specified", async () => {
		const response = await weatherTool.function({
			latitude: "47.8095",
			longitude: "13.0550",
			start_date: "2025-01-01",
			end_date: "2025-01-01",
		});
		assert.ok(response.content[0].text.length > 0);
	});
});

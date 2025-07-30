import { z } from "zod";
import type { Tool } from "./tool.interface.js";

const weatherToolArgValidator = {
	latitude: z.string().describe("Latitude of the location, e.g., 47.8095"),
	longitude: z.string().describe("Longitude of the location, e.g., 13.0550"),
	start_date: z
		.string()
		.describe(
			"Start date for the weather data in YYYY-MM-DD format, e.g., 2025-07-25",
		),
	end_date: z
		.string()
		.describe(
			"End date for the weather data in YYYY-MM-DD format, e.g., 2025-07-25",
		),
	timezone: z
		.enum(["Europe/London", "America/New_York", "Asia/Tokyo"])
		.default("Europe/London")
		.describe(
			"Timezone for the weather data, e.g., Europe/London, America/New_York, Asia/Tokyo",
		),
};

type WeatherToolArgs = {
	latitude: string;
	longitude: string;
	start_date: string;
	end_date: string;
	timezone: "Europe/London" | "America/New_York" | "Asia/Tokyo";
};

export const weatherTool: Tool = {
	tool_name: "weather",
	description:
		"Gets Weather Data from Open Meteo API by passing required parameters like latitude, longitude, start_date, end_date, and timezone.",
	inputSchema: weatherToolArgValidator,
	function: async (args: WeatherToolArgs) => {
		const { latitude, longitude, start_date, end_date } = args;

		// Construct the Open Meteo API URL
		const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${start_date}&end_date=${end_date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=${args.timezone}`;

		try {
			const response = await fetch(apiUrl);
			if (!response.ok) {
				throw new Error(`Error fetching weather data: ${response.statusText}`);
			}
			const data = await response.json();
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(data, null, 2),
					},
				],
			};
		} catch (error: unknown) {
			return {
				content: [
					{
						type: "text",
						text: `Failed to fetch weather data: ${(error as unknown as { message: string }).message}`,
					},
				],
			};
		}
	},
};

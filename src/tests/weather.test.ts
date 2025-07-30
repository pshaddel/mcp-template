import { describe, it } from "node:test";
import { weatherTool } from "../tools/weather.js";
import assert from "assert";

describe("Weather Tool Tests", () => {
    it('tool should have a truthy string as name', () => {
        assert.ok(typeof weatherTool.tool_name === 'string' && weatherTool.tool_name.length > 0);
    });

    it('tool should have a truthy string as description', () => {
        assert.ok(typeof weatherTool.description === 'string' && weatherTool.description.length > 0);
    });

    it('Should get error when not passing required parameters', async () => {
        assert.ok((await weatherTool.function({})).content[0].text.includes('Failed to fetch weather data'));
        assert.ok((await weatherTool.function({ latitude: '47.8095' })).content[0].text.includes('Failed to fetch weather data'));
        assert.ok((await weatherTool.function({ longitude: '13.0550' })).content[0].text.includes('Failed to fetch weather data'));
        assert.ok((await weatherTool.function({ start_date: '2025-07-25' })).content[0].text.includes('Failed to fetch weather data'));
        assert.ok((await weatherTool.function({ end_date: '2025-07-25' })).content[0].text.includes('Failed to fetch weather data'));
    });

    it('Should give data when passing all required parameters', async () => {
        const response = await weatherTool.function({
            latitude: '47.8095',
            longitude: '13.0550',
            start_date: '2025-07-25',
            end_date: '2025-07-25',
            timezone: 'Europe/London'
        });
        assert.ok(response.content[0].text.includes('temperature_2m_max'));
        assert.ok(response.content[0].text.includes('temperature_2m_min'));
        assert.ok(response.content[0].text.includes('precipitation_sum'));
    });
})
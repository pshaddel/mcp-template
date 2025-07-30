/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
export interface Tool<Args = any> {
	tool_name: string;
	description: string;
	inputSchema: any;
	outputSchema?: any;
	function: (args: Args) => any;
}

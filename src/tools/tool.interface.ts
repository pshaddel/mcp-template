/** biome-ignore-all lint/suspicious/noExplicitAny: we do not want to make it strict here */
export interface Tool<Args = any> {
	tool_name: string;
	description: string;
	inputSchema: any;
	outputSchema?: any;
	function: (args: Args) => any;
}

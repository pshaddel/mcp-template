export async function queryRunner(query: string, variables: Record<string, unknown>): Promise<{ data?: unknown; error?: unknown }> {
	try {
		const headers: Record<string, string> = {
			"accept": "application/json",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "application/json",
			"cookie": `.Tunnels.Relay.WebForwarding.Cookies=; .Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZsb5kY_GRxjFWiECBt2DxrI010J5fMxwuWjsf2QS22j7gWmXZei1gHNzfGxignzHADd2AXwMOmOwncjanNOl1QynNjYu0lsUBj7QjKkTcXLsTQqABRjS0kufO6isNDywjg6RPJV0Dr1RxbVP5gXmYWR4uCxyzVOO6HMoH2qXuOZZpfI_TJd8VLw8_TPmel0FHoCBA6uxHd0TqZXHMO-olFFcWCPYtHdbQYpPRrNWMuXddQ_YsXL0bFW6mfwyTC-_Mm8ncxFOWXMuEXsVQLxNN9XjSxKoejWuqiyxKe204XJpNeb-6s6K6qN5EraGVpbqoocPUd8RFDkKRxHrILYMsmYU0hCOW5edcaVZ_kLPf89ye92mCZlMHLkoZEmYvciCeEzdcaPZ7hErIdr5YL6qCWko_TKNuh26QRE8iE61OFf6YVFgMNUt3JM2gbohv0Qzzadrb7h-P2GCh75OVYtN4k_Hhthw93mFh9qD508JkMlQbeoeikA1MizMuEjenWU_HcrI-9cNIDV4LuxRSwUFOQ5l9j5eOmn__zLT1skR76VcZL2tPkzW5ZRlkyd1T56pHq5aZKKXHsigTLASEkBAVHDTqqUOSCGmzmbtj1po_0K9qmLCAqk8fA99DSFGgEoaguEHETVv075_hpRIL1faBATZvMQSdLeGKcZs8qkn2f-xL6OznERQniAuzD14bffs5La--TM25IWpbKP64FN0sRm1M4y1y1KOx51PLDsrLBn1fCoL1Ob1ts8zPLKdFSoE5BIfuzxPKvVZTdb0TfQRN3ZlSVMGcWxxgn1kTTNrI3YASEjFC8eqjZA-K5r5WROhQghkGVR97hnynraftZehDBv0WwB_Vx1-q9i3pqHwgPM7Uefx8OUe7LkOKqeqVpaaswedrzQes-AUI1Cy_71jb0iy8wp0bqtrgZ7ma3ZnXPE7F8PLcJ2bQveewNyVH5YbXpaE7F9s9PEIzWg02sr-tuZWgotaNUh-AeeRd2P9MtjE3tuxNh4O4weCjNFum_xiq_HuGX_J1YAVUVz2Pzr4VsSNB781qKOLWq6pU1kTuUM4BL88w0tQJ-mX8XZMlp4cCDax-BM1Oy8DG4gFa3xUm_bW1w544huxzact7xVRyAvoi0cVx7JwpAElVeoTPU5g7a0jF5Sssfr6FuIHw-rjbmfaxJwsq4gi435-DyqySxHfuiSYS4kPXHqOWCPwydEhqVI9wT2TJHF9lR_EaEzBK0e8p-JAEEqPZYCzoFxFtsCcugSL0Qh-xbfuThvQkaSYl2o1MT1HtZYuxg5qrzS0voFRnhtrCmlk2bEi91VfoBpKQxmRGZ_qo19WtYPXqsC6X4QHq0v1BUvSTST2zVdT3R_z5InvRWEj9CEBWedf4WbWhdboQ1ad6iLEXt_Hml5AjusZpbdCBgm10Hbc73-M_oNk0fgoxB2isQ5dzcxcstLFO6K6OkGhYsmo3IjYi05dY9qrIMmUtFKWKwsrajUGMkmu3o0jYARVmF8OgIcnt3Czo6TlmewjDw5lQDeRtdFMl03y8yUuGm2JidgbTRGXrraliVZi0ViAqzY-js0omDFpMJ4lMem2C76-7kP-mdjimM; tunnel_phishing_protection=spiffy-hill-89m7b49.euw`
		};

		const url = "https://upgraded-sniffle-wgr7vp47jwwc54xp-8080.app.github.dev/graphql";
		// const url = "http://localhost:8080/graphql";
		console.log(query, variables);
		const res = await fetch(url, {
			headers,
			body: JSON.stringify({
				query: query,
				variables: variables
			}),
			method: "POST",
			credentials: "include"
		})
		console.log("GraphQL response status:", res.status);

		if (!res.ok) {
			const errorBody = await res.text();
			return { data: null, error: `GraphQL query failed with status ${res.status}: ${errorBody}` };
		}
		const data = await res.json();
		return { data, error: null };
	} catch (error) {
		console.error("Error in queryRunner:", error);
		return { error: error as Error, data: null };
	}
}
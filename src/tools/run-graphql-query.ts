export async function queryRunner(query: string, variables: Record<string, unknown>): Promise<{ data?: unknown; error?: unknown }> {
	try {
		const headers: Record<string, string> = {
			"accept": "application/json",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "application/json",
			"cookie": `.Tunnels.Relay.WebForwarding.Cookies=; tunnel_phishing_protection=jolly-lake-wntx820.euw; .Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZt9AkBpYMGTRiLTeIImGhTfNL_4xTr56tvqrrTNWcmrorSSnYc0L8cybSz2zYdtE0ygsDMKkedG9Ep7WX51Ia3AI0G9gmO9YizSnI9eQ2TKTRTBR8y4MjS3Toav9GgkPN5e3G69MFMHdSW8A2NASqEOLpJMBuEV1-4N0Eb_ctYl7zYuPl0P9kP_UoQJtEIqPkXofvI-PggYU1bOohmMvBZwTFyLr2ww1u7RJbozsk631nq8S9BkRpJgaZ6zVC7iQJPAPOrjH734WfcZHVonC3xNYK1pIgptIsdRrG7GElaY_T2aiqzor2lgF05ZwSR00JM0ap73eAVaCx5qkTYyo3HUBQMbrRmIL-19Zx8e3bRGnBywocxbh7NMPPA2VpuWVh2PNYj9LcP6LuQagx9zMahmpTrIqrRWOrciKBqL8LVozGsxBhWDWDO8cjGtY5tWDGGgAQdm8gZLMyZI0x0RG51hfC8-Wz9BSlJL2bYiVOmOoBE0HEhMzoVivLbM_SSoEtJzQouHhEJv0yOwsCgr_e-M7Ymm7qh6BPjEdrh6z5ZaKzP9b-C26_sIbiXKxN4G-CZpKpnJCTePr-CMlLW3X8-EJ9aeBCmSfPKJD8C3dbTs4BJdJxtwAiqnsz5UYNwAp44s3xOA_QzysbmcNzfDE3jdCxZBMq6x7UlaoTcwDE1b9wuzomt1R_j223Q1dKMjgSHwAbxWmkHsBsghzXtjvcdwx3UkWWo1WM6vU9aepvCeyLswlcDL4SQXQW0JtVfjjaiUEMrQKTjkGHNffHuBiaRG58pgn7fT0Mkg8V21ivczkCDqKbT2cwOqXV_3ARdyZJ1Rdwy46EGVcFIN_3cacpbNgAyUKiLqXESIQk4j6V-G2HvVL0fYSfKRm5DGkik2Dn8DAy7IUB07Dxt25UXCpHcXIHoLqCNk6O7TjqAvN03UnSgf2FYRmsuZ3EWraOmKh69ajVnp4AUxWYzUSuQNSo2HBE0BptlLN0iFI9IqNQGXSYytuqgOb8534r3vdnP2Iqafp8YXwKnTiFxhJLqKfzr_gABy7eIR2-aYOSeONd6U-lhZYACpoPpE6dkPcNGf5nSxAIaBxea4pmQ3ZVmiLab86SBPiFK-6802xwTNn3EMigWtN0DXDl-k7tUba9OKysZ7ipwdg5AXPu4qq4hbUUjVQF83WivhIP8S2AxAf7xoFFIOLbvPpeyJ2dior6co4oG02SZBJPI9hVGUUSZq56P3tzgoNEC6fDFA4SxyqtzrApGNYG5gy1WBMTzI9bzpF_iy_X3dF-cXtBAWmqwzYMzKPE72sD5pizrpFVOG9b-LaF_blrv6-cIKGMiyILdrblX0mFx9FNb-7J_qy1deXpJ2tXKCwfSC7-P_9No56qTAunSEjK0Enr2yRx8Iep6kN17AoeAkDaLDyLatwbI_NhH0ZBz7AqwOH8c4hSUsMRM1IQ0RLqonTw5wH8zq0Fbhp235KAMRO4W_WM0mKGU-OTEABbpxoNni8kYfGK9k5pX-_eKEauwibZWBXWilef3o_Piy87zJPM4W1hoWDbT7vD_SEe1vPNW0Ej6G6B3btpvSgA`
		};

		const res = await fetch("https://upgraded-sniffle-wgr7vp47jwwc54xp-8080.app.github.dev/graphql", {
			headers,
			body: JSON.stringify({
				query: query,
				variables: variables
			}),
			method: "POST",
			credentials: "include"
		});

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
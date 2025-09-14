// Store cookies globally
let storedCookies: string = '';

// Function to extract and store cookies from Set-Cookie headers
function updateCookiesFromResponse(response: Response): void {
	const setCookieHeaders = response.headers.get('set-cookie');
	if (setCookieHeaders) {
		// Parse and store the cookies
		storedCookies = setCookieHeaders;
	}
}

export async function queryRunner(query: string, variables: Record<string, unknown>): Promise<{ data?: unknown; error?: unknown }> {
	try {
		// First, make an initial request to get cookies if we don't have any
		if (!storedCookies) {
			try {
				const initialResponse = await fetch("https://upgraded-sniffle-wgr7vp47jwwc54xp-8080.app.github.dev/", {
					method: "GET",
					credentials: "include"
				});
				updateCookiesFromResponse(initialResponse);
			} catch (error) {
				console.warn("Failed to get initial cookies:", error);
			}
		}

		const headers: Record<string, string> = {
			"accept": "application/json",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "application/json"
		};

		// Add cookies if we have them
		if (storedCookies) {
			headers["cookie"] = storedCookies;
		}

		const res = await fetch("https://upgraded-sniffle-wgr7vp47jwwc54xp-8080.app.github.dev/graphql", {
			headers,
			body: JSON.stringify({
				query: query,
				variables: variables
			}),
			method: "POST",
			credentials: "include"
		});

		// Update cookies from response if present
		updateCookiesFromResponse(res);

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

// Export helper functions for manual cookie management if needed
export function setCookies(cookies: string): void {
	storedCookies = cookies;
}

export function getCookies(): string {
	return storedCookies;
}

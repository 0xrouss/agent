import { config } from "../config/config";
import { getGamesByOwner, getLevelDescription } from "../database/queries";

export function startApiServer() {
    Bun.serve({
        port: config.api.port || 3000,
        async fetch(req) {
            const url = new URL(req.url);

            // GET /games/:userAddress
            if (req.method === "GET" && url.pathname.startsWith("/games/")) {
                const userAddress = url.pathname.split("/")[2];
                const games = await getGamesByOwner(userAddress);

                return new Response(JSON.stringify(games), {
                    headers: { "Content-Type": "application/json" },
                });
            }

            // NEW: GET /game/:gameId/current-level
            if (req.method === "GET" && url.pathname.match(/\/game\/\d+\/current-level/)) {
                const gameId = parseInt(url.pathname.split("/")[2]);
                const description = await getLevelDescription(gameId);

                if (!description) {
                    return new Response("No active level found", { status: 404 });
                }

                return new Response(JSON.stringify(description), {
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response("Not Found", { status: 404 });
        },
    });

    console.log(`API server running on port ${config.api.port || 3000}`);
}

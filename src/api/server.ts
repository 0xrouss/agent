import { config } from "../config/config";
import { getGamesByOwner, getLevelNillionUUID } from "../database/queries";
import { getLevelDescription } from "../nillion";

export function startApiServer() {
    Bun.serve({
        port: config.api.port || 3000,
        async fetch(req) {
            // Add CORS headers
            const corsHeaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            };

            // Handle OPTIONS preflight requests
            if (req.method === "OPTIONS") {
                return new Response(null, { headers: corsHeaders });
            }

            const url = new URL(req.url);

            // GET /games/:userAddress
            if (req.method === "GET" && url.pathname.startsWith("/games/")) {
                const userAddress = url.pathname.split("/")[2];
                const games = await getGamesByOwner(userAddress);

                return new Response(JSON.stringify(games), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // NEW: GET /game/:gameId/current-level
            if (req.method === "GET" && url.pathname.match(/\/game\/\d+\/current-level/)) {
                const gameId = parseInt(url.pathname.split("/")[2]);
                const nillionUUID = await getLevelNillionUUID(gameId);

                const description = await getLevelDescription(nillionUUID);

                if (!description) {
                    return new Response("No active level found", { status: 404 });
                }

                return new Response(JSON.stringify(description), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            return new Response("Not Found", { 
                status: 404,
                headers: corsHeaders 
            });
        },
    });

    console.log(`API server running on port ${config.api.port || 3000}`);
}

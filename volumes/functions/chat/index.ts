// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

//import { serve } from "https://deno.land/std@0.177.1/http/server.ts"
import getFriend from './routes/getFriend.ts'
Deno.serve(async (req: Request) => {
  const path = new URL(req.url).pathname.split("/").pop();
  switch (path) {
    case "getFriend":
      return getFriend(req);
    default:
      return new Response("Not found", { status: 404 });
  }
});

// To invoke:
// curl 'http://localhost:<KONG_HTTP_PORT>/functions/v1/hello' \
//   --header 'Authorization: Bearer <anon/service_role API key>'

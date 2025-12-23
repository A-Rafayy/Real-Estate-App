import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 });
  }

  try {
    const response = await axios.get(
      "https://us1.locationiq.com/v1/autocomplete",
      {
        params: {
          key: process.env.NEXT_PUBLIC_LOCATIONIQ_KEY,
          q: query,
          limit: 5,
          format: "json",
        },
      }
    );
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch locations" }), { status: 500 });
  }
}

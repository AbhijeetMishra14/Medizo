/**
 * Netlify Function to proxy API requests to Render backend
 * This function forwards all API requests to the Render backend service
 */

export const handler = async (event: any, context: any) => {
  const backendUrl = process.env.RENDER_BACKEND_URL || "https://medizo-z364.onrender.com";
  const path = event.path.replace("/.netlify/functions/api", "");
  const url = new URL(path, backendUrl).toString();

  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body || undefined,
    });

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: responseBody,
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Backend service unavailable" }),
    };
  }
};

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const path = new URL(request.url).pathname.slice(1);
    if (!path || path.split("/").includes("..")) {
      return new Response("Invalid file path", { status: 400 });
    }

    const encodedPath = path
      .split("/")
      .map(encodeURIComponent)
      .join("/");

    return fetch(
      `https://storage.bunnycdn.com/gcore/${encodedPath}`,
      {
        method: request.method,
        headers: { AccessKey: env.BUNNY_STORAGE_PASSWORD },
        cf: {
          cacheEverything: true,
          cacheTtlByStatus: {
            "200-299": 86400,
            "401": 0,
            "404": 0,
            "500-599": 0
          }
        }
      }
    );
  }
};

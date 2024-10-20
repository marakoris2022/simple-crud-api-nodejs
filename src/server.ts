import "dotenv/config";
import http from "http";
import url from "url";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "GET" && parsedUrl.pathname === "/get") {
    // handleGetRequest(req, res);
  } else if (req.method === "POST" && parsedUrl.pathname === "/post") {
    // handlePostRequest(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

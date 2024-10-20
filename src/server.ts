import "dotenv/config";
import * as http from "http";
import * as url from "url";
import {
  handleDeleteRequest,
  handleGetRequest,
  handlePostRequest,
  handlePutRequest,
} from "./api/users.ts";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "GET" && parsedUrl.pathname.startsWith("/api/users")) {
    handleGetRequest(req, res);
  } else if (req.method === "POST" && parsedUrl.pathname === "/api/users") {
    handlePostRequest(req, res);
  } else if (
    req.method === "PUT" &&
    parsedUrl.pathname.startsWith("/api/users")
  ) {
    handlePutRequest(req, res);
  } else if (
    req.method === "DELETE" &&
    parsedUrl.pathname.startsWith("/api/users")
  ) {
    handleDeleteRequest(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default server;

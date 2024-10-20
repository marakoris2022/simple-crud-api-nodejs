import http from "http";
import { validate as uuidValidate } from "uuid";
import { DATA_STORE } from "../database/db.js";

export const handleGetRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const parsedUrl = req.url.split("/");

  if (parsedUrl.length === 3) {
    try {
      const users = DATA_STORE.getUsers();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } catch {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error");
    }
  } else if (parsedUrl.length > 3) {
    const userId = parsedUrl[3];

    if (!uuidValidate(userId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(
        "400 Bad Request: userId is in an invalid format. Example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'"
      );
      return;
    }

    try {
      const userData = DATA_STORE.getUserById(userId);

      if (userData) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(userData));
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`404 Not Found: No user found with id ${userId}`);
      }
    } catch {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found: Invalid route");
  }
};

// routes/postRequest.js
export const handlePostRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  let body = "";

  // Listen for data chunks
  req.on("data", (chunk) => {
    body += chunk.toString(); // Append chunk to body string
  });

  // When all data is received
  req.on("end", () => {
    const parsedBody = JSON.parse(body); // Parse the JSON body

    // Respond with the parsed body data
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "POST request received",
        data: parsedBody,
      })
    );
  });
};

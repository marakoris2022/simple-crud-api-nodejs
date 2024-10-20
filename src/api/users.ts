import http from "http";
import { validate as uuidValidate } from "uuid";
import { DATA_STORE } from "../database/db.js";

export const handleGetRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  const parsedUrl = req.url.split("/");
  if (parsedUrl.length === 3) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(DATA_STORE.getUsers()));
  } else if (parsedUrl.length > 3) {
    const userId = parsedUrl[3];

    if (!uuidValidate(userId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("400 userId is invalid format");
      return;
    }

    const userData = DATA_STORE.getUserById(userId);

    if (userData) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(userData));
      return;
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("id === userId doesn't exist");
      return;
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
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

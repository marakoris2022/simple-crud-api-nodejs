// routes/getRequest.js
import url from "url";

export const handleGetRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse the URL with query params
  const query = parsedUrl.query; // Extract query params

  // Respond with the query parameters received
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "GET request received",
      data: query,
    })
  );
};

// routes/postRequest.js
export const handlePostRequest = (req, res) => {
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

import http from "http";
import { validate as uuidValidate } from "uuid";
import { DATA_STORE, UserProps } from "../database/db.js";
import { isObjectValid } from "../helpers/utils.js";

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

export const handlePostRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    let parsedBody;

    try {
      parsedBody = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`400 Bad Request: Invalid JSON format`);
      return;
    }

    if (!isObjectValid(parsedBody)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`400 Bad Request: Body does not contain required fields`);
      return;
    }

    try {
      DATA_STORE.addUser(parsedBody);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "User added successfully to the DataBase",
          data: parsedBody,
        })
      );
    } catch {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error: Could not add user to the database");
    }
  });
};

export const handlePutRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const parsedUrl = req.url.split("/");
  let userId = "";
  let body = "";

  if (parsedUrl.length > 3) {
    userId = parsedUrl[3];

    if (!userId || !uuidValidate(userId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(
        "400 Bad Request: userId is in an invalid format. Example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'"
      );
      return;
    }
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("400 Bad Request: userId is required");
    return;
  }

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    let parsedBody: null | UserProps = null;

    try {
      parsedBody = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`400 Bad Request: Invalid JSON format`);
      return;
    }

    if (!isObjectValid(parsedBody)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`400 Bad Request: Body does not contain required fields`);
      return;
    }

    try {
      const updatedUserData = DATA_STORE.updateUser(userId, parsedBody);

      if (updatedUserData) {
        res.writeHead(200, { "Content-Type": "application/json" }); // Use 200 for updates
        res.end(
          JSON.stringify({
            message: "User updated successfully in the database",
            data: updatedUserData,
          })
        );
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`404 Not Found: No user found with id ${userId}`);
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(`500 Internal Server Error: ${error.message}`);
    }
  });
};

export const handleDeleteRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const parsedUrl = req.url?.split("/");
  let userId = "";

  if (parsedUrl && parsedUrl.length > 3) {
    userId = parsedUrl[3];

    if (!userId || !uuidValidate(userId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(
        "400 Bad Request: userId is in an invalid format. Example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'"
      );
      return;
    }

    if (DATA_STORE.deleteUser(userId)) {
      res.writeHead(204);
      res.end(`User deleted UID: ${userId}`);
      return;
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`404 Not Found: No user found with id ${userId}`);
      return;
    }
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("400 Bad Request: userId is required");
    return;
  }
};

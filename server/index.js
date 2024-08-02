const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

let clients = [];

// Health check
app.get("/health", (req, res) => {
  res.send("App is running !!");
});

// Complete task and notify all clients
app.post("/tasks/complete/:id", (req, res) => {
  const taskId = req.params.id;
  let message = "";
  clients.forEach((client) => {
    if (client.id === req.headers["x-client-id"]) {
      message = `You completed task:${taskId}`;
      client.res.write(`data: ${message}\n\n`);
    } else {
      message = `One of your teammates completed task:${taskId}`;
      client.res.write(`data: ${message}\n\n`);
    }
  });
  res.status(200).send({ message });
});

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  
  const client = {
    id: req.query.clientId,
    res,
  };

  clients.push(client);

  req.on("close", () => {
    clients = clients.filter((client) => client.id !== client.id);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

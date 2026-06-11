const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

const routes = require("./routes");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔥 UNE SEULE FOIS /api
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Create an express app and set the port number.
const app = express();
const port = 3000;

// Sets the API base-url
const API_url = "https://api.magicthegathering.io/v1";

// Use the public folder for static files.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(`${API_url}/cards`);
    //     console.log(result.data.cards.length);
    res.render("index.ejs", { cards: result.data.cards });
  } catch (error) {
    console.log(error.response.data);
    res.status(500);
  }
});

app.post("/textSearch", async (req, res) => {
  const digitPattern = /\d/;

  let result;
  // Check is the retrieved string contains digits. If so, it is an ID.
  if (digitPattern.test(req.body.searchName)) {
    try {
      result = await axios.get(`${API_url}/cards/${req.body.searchName}`);
      res.render("index.ejs", { cards: [result.data.card] });
    } catch (error) {
      console.log(error.response.data);
      res.status(500);
    }

    // I make sure that the single card in the result is in an array - for the ejs to be able to render it correctly.
  } else {
    try {
      result = await axios.get(`${API_url}/cards?name=${req.body.searchName}`);
      res.render("index.ejs", { cards: result.data.cards });
    } catch (error) {
      console.log(error.response.data);
      res.status(500);
    }
  }
});

app.post("/colorSearch", async (req, res) => {
  let colors = "";
  if (req.body.white) {
    colors += "white|";
  }
  if (req.body.blue) {
    colors += "blue|";
  }
  if (req.body.black) {
    colors += "black|";
  }
  if (req.body.red) {
    colors += "red|";
  }
  if (req.body.green) {
    colors += "green|";
  }

  // To remove the last pipe (|)
  colors = colors.slice(0, -1);

  try {
    const result = await axios.get(`${API_url}/cards?colors=${colors}`);
    res.render("index.ejs", { cards: result.data.cards });
  } catch (error) {
    console.log(error.response.data);
    res.status(500);
  }
});

// Listens on the predefined port and start the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/**
 * @file index.js
 * @author Devin Arena
 * @description The express backend for UseRoux.
 * @since 6/6/2022
 **/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@useroux.zaavxjk.mongodb.net`;
const port = process.env.PORT || 3000;

const client = new MongoClient(URL);

const app = express();

app.use(express.json());
app.use(cors());

const init = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
    client.close();
  }
};

const allSolves = async (_req, res) => {
  const solves = await client
    .db("useroux")
    .collection("solves")
    .find()
    .toArray();

  return res.json(solves);
};

const solve = async (req, res) => {
  const { _id } = req.query;

  console.log(_id);

  if (!ObjectId.isValid(_id)) {
    return res.json({ err: "No solve found with that id." });
  }

  const solve = await client
    .db("useroux")
    .collection("solves")
    .findOne({ _id: ObjectId(_id) });

  if (!solve) {
    return res.json({ err: "No solve found with that id." });
  }

  return res.json(solve);
};

const upload = async (req, res) => {
  const solve = req.body;

  if (!solve) {
    return res.json({ err: "A solve must be given." });
  }
  if (!solve.title || !solve.scramble || !solve.steps) {
    return res.json({ err: "A solve must have a title, scramble and steps." });
  }
  for (const step of solve.steps) {
    if (!step || !step.title || !step.algorithm) {
      return res.json({ err: "A step must have a title and algorithm." });
    }
  }

  const newSolve = await client.db("useroux").collection("solves").insertOne({
    title: solve.title,
    description: solve.description,
    posted: new Date().toISOString(),
    time: solve.time,
    scramble: solve.scramble,
    nickname: solve.nickname,
    steps: solve.steps,
  });

  return res.json({
    _id: newSolve.insertedId,
  });
};

app.get("/api/solves", allSolves);
app.get("/api/solve", solve);

app.post("/api/upload", upload);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  init();
});

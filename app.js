const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const mongoUri = "mongodb://localhost:27017";

const dbClient = new MongoClient(mongoUri);
const app = express();

// post请求数据处理
app.use(express.json());

app.get("/", function (req, res) {
  res.send("hello world11");
});

app.post("/articles", async (req, res, next) => {
  try {
    const { article } = req.body;

    if (!article || !article.title || !article.description || !article.body) {
      res.status(422).json({
        error: "请求参数错误",
      });
    }
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    article.createdAt = new Date();
    article.updatedAt = new Date();
    const ret = await collection.insertOne(article);
    article._id = ret.insertedId;
    res.status(201).json({
      article,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/articles", async (req, res, next) => {
  try {
    const { _page = 1, _size = 10 } = req.query;
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    const ret = await collection
      .find() // 查询数据
      .skip(Number(_page - 1) * _size) // 跳过多少条
      .limit(Number(_size)); // 拿多少条
    const articles = await ret.toArray();
    const articlesCount = await collection.countDocuments();

    res.status(200).json({
      articles,
      articlesCount,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    const article = await collection.findOne({
      _id: ObjectId(req.params.id),
    });
    res.status(200).json({
      article,
    });
  } catch (err) {
    next(err);
  }
});

app.patch("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");

    await collection.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: req.body.article,
      }
    );
    const article = await collection.findOne({
      _id: ObjectId(req.params.id),
    });
    res.status(201).json({
      article,
    });
  } catch (err) {
    next(err);
  }
});

app.delete("/articles/:id", async (req, res, next) => {
  try {
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");

    await collection.deleteOne({
      _id: ObjectId(req.params.id),
    });

    res.status(200).json({
      ret: 0,
    });
  } catch (err) {}
});
// 错误处理中间件
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
  });
});
app.listen(3000, () => {
  console.log("server is listening at 3000");
});

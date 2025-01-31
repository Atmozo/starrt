const redis = require("redis");
const client = redis.createClient();
client.connect();

module.exports = async (req, res, next) => {
  const key = req.originalUrl;
  const data = await client.get(key);

  if (data) {
    return res.json(JSON.parse(data));
  } else {
    res.sendResponse = res.json;
    res.json = async (body) => {
      await client.setEx(key, 60, JSON.stringify(body)); // Cache for 60 sec
      res.sendResponse(body);
    };
    next();
  }
};

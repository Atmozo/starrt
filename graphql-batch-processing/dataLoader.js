const DataLoader = require('dataloader');
const { getUsersByIds } = require('./fakeDatabase');

const userLoader = new DataLoader(async (keys) => {
  return await getUsersByIds(keys);
});

module.exports = { userLoader };


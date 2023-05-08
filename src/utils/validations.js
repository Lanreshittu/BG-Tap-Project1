const expectedKeysChecker = (req, expectedKeysArray) => {
  return new Promise((resolve, reject) => {
    for (const key in req.body) {
      if (!expectedKeysArray.includes(key)) {
        reject(`'${key}' Field not allowed`);
      }
    }
    resolve(true);
  });
};

module.exports = { expectedKeysChecker };

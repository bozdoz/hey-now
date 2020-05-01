/**
 * @param {number} time  Time to wait
 */
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * @param {string} message
 */
const wordCount = (message) => {
  const match = message.match(/\s/g);
  const count = match ? match.length : 0;

  return count + 1;
};

module.exports = {
  wait,
  wordCount,
};

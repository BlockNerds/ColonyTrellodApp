const ecp = require('./ecp');
import web3Utils from "web3-utils";
const getRandomString = require('./test-helper');

const example = async (colonyClient) => {
  // Initialise the Extended Colony Protocol

  await ecp.init();

  // Create a task in the root domain

  const RATING_1_SALT = web3Utils.soliditySha3(getRandomString(10));

  const ratingSecret = await colonyClient.generateSecret.call({RATING_1_SALT, 5 });

  await colonyClient.submitTaskWorkRating.send({
    taskId: 1
    role: 'WORKER',
    ratingSecret,
  });

  // Do some cleanup
  await ecp.stop();
}

module.exports = example;

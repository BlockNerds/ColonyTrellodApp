const ecp = require('./ecp');

const example = async (colonyClient) => {
  // Initialise the Extended Colony Protocol

  await ecp.init();

  // Create a task!
  const specificationHash = await ecp.saveTaskSpecification({ title: 'newtask', description: 'taskdesc' });

  // Unique, immutable hash on IPFS
  console.log('Specification hash', specificationHash);

  // Create a task in the root domain
  //const { eventData: { taskId }} = await colonyClient.createTask.send({ specificationHash, domainId: 1 });

//todo
  const ratingSecret = await colonyClient.generateSecret.call({ "salt", 5 });

  await colonyClient.submitTaskWorkRating.send({
    taskId: 1
    role: 'WORKER',
    ratingSecret,
  });
  
  // Let's take a look at the newly created task
  //const task = await colonyClient.getTask.call({ taskId })
  //console.log(task);

  // Do some cleanup
  await ecp.stop();
}

module.exports = example;

require('./tracing'); // Initialize tracing before anything else

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [{ key: 'key1', value: 'Hello Kafka with tracing!' }],
  });
  console.log('Message sent.');
  await producer.disconnect();
};

runProducer().catch(console.error);


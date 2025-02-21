const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Path to the .proto file
const PROTO_PATH = path.join(__dirname, 'proto', 'hello.proto');

// Load 
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

//  client connected to the gRPC server
const client = new helloProto.Greeter('localhost:50051', grpc.credentials.createInsecure());

// Call the SayHello RPC
client.SayHello({ name: 'World' }, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Greeting:', response.message);
  }
});

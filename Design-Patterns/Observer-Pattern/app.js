import emitter from "./eventEmitter.js";

emitter.on("orderPlaced", (orderId) => {
  console.log(`Order received: ${orderId}`);
});

emitter.emit("orderPlaced", "12345");


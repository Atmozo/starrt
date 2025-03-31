import api from "./proxy.js";

api.request("https://jsonplaceholder.typicode.com/posts");
api.request("https://jsonplaceholder.typicode.com/posts"); // Cached response


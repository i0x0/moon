import Server from "./Server";

try {
  new Server()
} catch (e) {
  console.log("globalServerError", e);
}

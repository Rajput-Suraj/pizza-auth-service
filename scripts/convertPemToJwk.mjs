import fs from "node:fs";
import path from "node:path";
import rsaPemToJwk from "rsa-pem-to-jwk";

const privatekey = fs.readFileSync(
  path.join(process.cwd(), "certs/private.pem"),
);

const jwk = rsaPemToJwk(privatekey, { use: "sig" }, "public");

console.log(JSON.stringify(jwk));

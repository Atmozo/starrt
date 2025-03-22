import { CompactEncrypt, jwtDecrypt, generateKeyPair } from "jose";

async function encryptJWT() {
  const { publicKey, privateKey } = await generateKeyPair("RSA-OAEP-256");

  const payload = new TextEncoder().encode(JSON.stringify({ user: "mozo", role: "admin" }));

  const encryptedJWT = await new CompactEncrypt(payload)
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(publicKey);

  console.log("Encrypted JWT:", encryptedJWT);

  return { encryptedJWT, privateKey };
}

async function decryptJWT(encryptedJWT, privateKey) {
  const { payload, protectedHeader } = await jwtDecrypt(encryptedJWT, privateKey, {
    algorithms: ["RSA-OAEP-256"],
  });

  console.log("Decrypted Payload:", payload); // Directly log as JSON
  console.log("Protected Header:", protectedHeader);
}

async function run() {
  const { encryptedJWT, privateKey } = await encryptJWT();
  await decryptJWT(encryptedJWT, privateKey);
}

run();


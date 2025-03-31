import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

const ISSUER = process.env.ISSUER;
const AUDIENCE = process.env.AUDIENCE;

// Set up the JWKS client
const client = jwksClient({
  jwksUri: `${ISSUER}.well-known/jwks.json`,
});

// Function to get the signing key
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err, null);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// Verify JWT
export const validateJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: AUDIENCE,
        issuer: ISSUER,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) return reject("Invalid token");
        resolve(decoded);
      }
    );
  });
};


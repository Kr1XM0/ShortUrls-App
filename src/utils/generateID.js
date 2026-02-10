import crypto from "node:crypto";

function generateID(size = 7) {
  const chars = "abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY1234567890";
  const bytes = crypto.randomBytes(size);

  let ID = "";

  for (let x = 0; x < size; x++) {
    ID += chars[bytes[x] % chars.length];
  }

  return ID;
}

export default generateID;

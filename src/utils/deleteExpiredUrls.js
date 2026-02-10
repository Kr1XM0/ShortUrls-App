import Url from "../models/Url.js";

async function deleteExpiredShortUrls() {
  const result = await Url.deleteExpired();

  if (result.changes > 0) {
    console.log(`Deleted ${result.changes} expired short URLs`);
  } else {
    console.log("No expired URLs to delete");
  }

  return result.changes;
}

export default deleteExpiredShortUrls;

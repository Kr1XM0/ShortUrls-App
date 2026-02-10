import generateID from "../utils/generateID.js";
import { cookies } from "../config/app.js";

const userAuth = (req, res, next) => {
  let userToken = req.cookies.userToken;

  if (!userToken) {
    userToken = generateID(16);
    res.cookie("userToken", userToken, cookies);
  }

  req.userToken = userToken;
  next();
};

export default userAuth;

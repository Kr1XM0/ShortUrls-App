import generateID from "../utils/generateID.js";
import validateUrls from "../validators/urlValidator.js";
import Url from "../models/Url.js";
import { APP_DOMAIN } from "../config/app.js";

class urlController {
  static async getUserUrls(req, res) {
    const userToken = req.userToken;

    const result = await Url.findByUsersToken(userToken);

    res.status(200).json(result);
  }

  static async creatShortUrls(req, res) {
    const validation = validateUrls(req.body);

    const cant = await Url.numberOfLinks(req.userToken);

    if (cant >= 10) {
      return res
        .status(429)
        .json({ error: "You have reached the limit of links" });
    }

    if (!validation.success) {
      return res.status(406).json({
        error: validation.error.issues[0].message,
      });
    }

    const { alias, original_url } = validation.data;

    if (alias && (await Url.aliasExists(alias))) {
      return res.status(400).json({
        error: "This alias is already in use",
      });
    }

    const id = generateID(7);
    while (await Url.idExists(id)) {
      id = generateID(7);
    }

    const created_at = new Date();
    const expires_at = new Date(
      created_at.getTime() + 14 * 24 * 60 * 60 * 1000,
    );

    const cleanAlias = alias === "" ? null : alias;

    const tiny_url = `${APP_DOMAIN}/${cleanAlias || id}`;

    const dataUrls = {
      id,
      alias: cleanAlias,
      original_url,
      tiny_url,
      userToken: req.userToken,
      created_at: created_at.toISOString(),
      expires_at: expires_at.toISOString(),
      clicks: 0,
    };

    await Url.create(dataUrls);

    const dataToRespond = {
      tiny_url: dataUrls.tiny_url,
      original_url: dataUrls.original_url,
    };

    res.status(200).json({
      dataToRespond,
    });
  }
}

export default urlController;

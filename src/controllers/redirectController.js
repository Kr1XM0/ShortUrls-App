import Url from "../models/Url.js";

class RedirectController {
  static async redirect(req, res) {
    const { id } = req.params;

    if (!id) {
      return;
    }

    Url.incrementClickCount(id, id);
    const urlToRedirect = await Url.findById(id, id);

    if (urlToRedirect === undefined || urlToRedirect === null) {
      return res.status(304).json({ error: "This link Expire" });
    }

    res.status(301).redirect(urlToRedirect.original_url);
  }
}

export default RedirectController;

import Pool from "../../data/database.js";
class Url {
  static async findByUsersToken(userToken) {
    const query = `SELECT tiny_url,original_url FROM url_schema.shorts_url WHERE user_token = $1`;
    const values = [userToken];
    const result = await Pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No links founded" });
    }

    return result.rows;
  }

  static async create(urlData) {
    const query = `
      INSERT INTO url_schema.shorts_url (id, alias, original_url, tiny_url, user_token, created_at, expires_at, clicks) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values = [
      urlData.id,
      urlData.alias,
      urlData.original_url,
      urlData.tiny_url,
      urlData.userToken,
      urlData.created_at,
      urlData.expires_at,
      urlData.clicks,
    ];
    return await Pool.query(query, values);
  }

  static async aliasExists(alias) {
    const query = "SELECT id FROM url_schema.shorts_url WHERE alias = $1";
    const values = [alias];
    const result = await Pool.query(query, values);
    return result.rows[0];
  }

  static async idExists(id) {
    const query = "SELECT id FROM url_schema.shorts_url WHERE id = $1";
    const values = [id];
    const result = await Pool.query(query, values);
    return result.rows[0];
  }

  static async numberOfLinks(userToken) {
    const query =
      "SELECT COUNT(*) FROM url_schema.shorts_url WHERE user_token = $1";
    const values = [userToken];
    const result = await Pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  static async deleteExpired() {
    const now = new Date().toISOString();
    const query = `DELETE FROM url_schema.shorts_url WHERE expires_at < $1`;
    const values = [now];
    return await Pool.query(query, values);
  }

  static async findById(id) {
    const query = `
      SELECT original_url
      FROM url_schema.shorts_url 
      WHERE id = $1 OR alias = $1
    `;
    const values = [id];
    const result = await Pool.query(query, values);
    return result.rows[0];
  }

  static async incrementClickCount(id) {
    const query = `
      UPDATE url_schema.shorts_url 
      SET clicks = clicks + 1 
      WHERE id = $1 OR alias = $1
    `;
    const values = [id];
    return await Pool.query(query, values);
  }
}

export default Url;

import BD from "../../database/database.js";

class Url {
  static async findByUsersToken(userToken) {
    const stmt = BD.prepare(
      `SELECT tiny_url,original_url FROM ShortUrls WHERE user_token = ?`,
    );

    if (stmt.length === 0) {
      return res.status(404).json({ error: "No links founded" });
    }

    return stmt.all(userToken);
  }

  static async create(urlData) {
    const stmt = BD.prepare(
      `INSERT INTO ShortUrls (id, alias, original_url, tiny_url, user_token, created_at, expires_at, clicks) 
      VALUES (@id, @alias, @original_url, @tiny_url, @userToken, @created_at, @expires_at, @clicks)`,
    );
    return stmt.run(urlData);
  }

  static async aliasExists(alias) {
    const stmt = BD.prepare("SELECT id FROM ShortUrls WHERE alias = ?");
    return stmt.get(alias);
  }

  static async idExists(id) {
    const stmt = BD.prepare("SELECT id FROM ShortUrls WHERE id = ?");
    return stmt.get(id);
  }

  static async deleteExpired() {
    const now = new Date().toISOString();

    const stmt = BD.prepare(`DELETE FROM ShortUrls WHERE expires_at < ?`);

    return stmt.run(now);
  }

  static async findById(id) {
    const stmt = BD.prepare(`
      SELECT original_url
      FROM ShortUrls 
      WHERE id = ? OR alias = ?
    `);
    return stmt.get(id, id);
  }

  static async incrementClickCount(id) {
    const stmt = BD.prepare(`
      UPDATE ShortUrls 
      SET clicks = clicks + 1 
      WHERE id = ? OR alias = ?
    `);
    return stmt.run(id, id);
  }

  static async NumberOfLinks(id) {
    const stmt = BD.prepare(`
      SELECT COUNT(*) AS links_number
      FROM ShortUrls
      WHERE user_token = ?
      `);
    return stmt.get(id).links_number;
  }
}

export default Url;

import { pool } from "../config/db.js";

export async function insertUsers(users) {
  const values = users.map((u) => [
    `${u.name.first} ${u.name.last}`,
    u.email,
    u.location.city,
    u.login.uuid,
  ]);

  await pool.query(`INSERT INTO users (name, email, city, uuid) VALUES ?`, [
    values,
  ]);
}

export async function getAllUsers() {
  const [rows] = await pool.query(`SELECT * FROM users`);
  return rows;
}

export async function updateUser(uuid, data) {
  await pool.query(`UPDATE users SET name=?, email=?, city=? WHERE uuid=?`, [
    data.name,
    data.email,
    data.city,
    uuid,
  ]);
}

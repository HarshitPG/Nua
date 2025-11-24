import { fetchRandomUsers } from "../utils/fetchRandomUsers.js";
import {
  insertUsers,
  getAllUsers,
  updateUser,
} from "../services/user.service.js";

export async function fetchAndStore(req, res) {
  try {
    const users = await fetchRandomUsers(1000);
    await insertUsers(users);
    res.json({ message: "Users inserted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listUsers(req, res) {
  const users = await getAllUsers();
  res.json(users);
}

export async function editUser(req, res) {
  const { uuid } = req.params;
  await updateUser(uuid, req.body);
  res.json({ message: "User updated" });
}

import axios from "axios";

export async function fetchRandomUsers(count = 1000) {
  const pages = Math.ceil(count / 20);
  let results = [];

  for (let i = 1; i <= pages; i++) {
    const res = await axios.get(
      `https://randomuser.me/api/?results=20&page=${i}`
    );
    results.push(...res.data.results);
  }

  return results.slice(0, count);
}

import md5 from "md5";
import { v4 as uuid } from "uuid";
import { sign } from "jsonwebtoken";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

const db = new JsonDB(new Config("db/users", true, false, "/"));
const { SECRET_KEY } = process.env;

export const getUsers = () => {
  return db.getData("/users");
};

export const addUser = (body) => {
  try {
    const id = uuid();
    body.password = md5(body.password);
    db.push("/users[]", { id, ...body }, true);
    return id;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const checkUsername = (username) => {
  try {
    return db.find("/users", (u) => u.username === username.trim().toLowerCase());
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const getUser = ({ username, password }) => {
  let user = db.find(
    "/users",
    (u) => u.username === username.trim().toLowerCase() && u.password === md5(password.trim())
  );
  if (user) {
    delete user.password;
    return sign({ user }, SECRET_KEY);
  }
  return undefined;
};

export const getUserById = (id) => {
  return db.find("/users", (u) => u.id === id);
};

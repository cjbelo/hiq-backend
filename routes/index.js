import { Router } from "express";
import { sign, verify } from "jsonwebtoken";
import { getUsers, getUser, getUserById, addUser, checkUsername, deleteUserById } from "../models/user.js";
import { verifyToken } from "../utils";

const router = Router();
const { SECRET_KEY } = process.env;

router.get("/", (req, res) => {
  res.json({ msg: "Hi! 👋" });
});

router.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = getUser(req.body);
    if (token) {
      res.json({ token });
    } else {
      res.json({ msg: "Invalid username and/or password" });
    }
  } else {
    res.json({ msg: "Empty username and/or password" });
  }
});

router.get("/api/profile", verifyToken, (req, res) => {
  verify(req.token, SECRET_KEY, (err, { user }) => {
    if (err) res.sendStatus(403);
    else {
      res.json({ user });
    }
  });
});

router.get("/api/users", (req, res) => {
  const users = getUsers();
  res.json(users);
});

router.get("/api/user/:id", (req, res) => {
  const user = getUserById(req.params.id);
  res.json({ user });
});

router.delete("/api/user/:id", (req, res) => {
  const deleted = deleteUserById(req.params.id);
  res.json({ deleted });
});

// Add User
router.put("/api/user", (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  if (firstName && lastName && email && username && password) {
    const usernameExists = checkUsername(username);
    if (usernameExists) {
      res.json({ msg: "Username exists" });
    }
    const id = addUser(req.body);
    res.json({ id });
  } else {
    res.json({ msg: "Missing field value" });
  }
});

export default router;

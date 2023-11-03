import express from "express";
import { UserRepository } from "../package/repository/user.repository.ts";
import { User } from "../package/model/user.ts";

const userRouter = express.Router();

const userRepository = new UserRepository();
userRouter
  .post("/register", async (req, res) => {
    try {
      const userData: User = req.body;
      const newUser = await userRepository.registerUser(userData);
      res.json(newUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  .post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const token = await userRepository.loginUser(username, password);
      res.json({ token });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  })

  .put("/update-password", async (req, res) => {
    try {
      const user = (await userRepository.getAuthorization(req)) as User;
      const { password, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        throw new Error("Password not match")
      }
      const updatedUser = await userRepository.updatePassword(
        user._id,
        password,
        newPassword
      );
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  // Update user by ID
  .put("/update-user", async (req, res) => {
    try {
      const user = (await userRepository.getAuthorization(req)) as User;
      const updateData = req.body;

      const updatedUser = await userRepository.updateUser(
        user?._id,
        updateData
      );
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

export default userRouter;

import { User, userModel } from "../model/user.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtString, saltRounds } from "../config.ts";
import { Request } from "express";
import { getToken } from "../util.ts";
export class UserRepository {
  // Find a user by ID
  async findUserById(userId: string) {
    return await userModel.findById(userId);
  }

  // Find a user by username
  async findUserByUsername(username: string) {
    return await userModel.findOne({ username });
  }

  async checkUserExist(username: string) {
    const user = await this.findUserByUsername(username);
    return user !== null;
  }
  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    if (newPassword && newPassword.length === 0) {
      throw new Error("New password is not empty");
    }
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const user = (await this.findUserById(userId)) as User;
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new Error("Old password is not match");
    }
    return await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        new: true,
      }
    );
  }

  // Update a user by ID
  async updateUser(
    userId: string,
    updateData: {
      name: string;
      YOB: number;
    }
  ) {
    if (updateData.YOB <= 0) {
      throw new Error("Year of age is more than 0");
    }
    if (updateData.name.length === 0) {
      throw new Error("Name is not empty");
    }
    return await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: updateData.name,
          YOB: updateData.YOB,
        },
      },
      {
        new: true,
      }
    );
  }

  // List all users
  async getAllUsers() {
    return await userModel.find();
  }

  async getAllNonAdminUsers() {
    return await userModel.find({ isAdmin: false });
  }

  async registerUser(userData: User) {
    // Hash the user's password using bcrypt
    if (userData.username.length === 0) {
      throw new Error("Username is not empty");
    }
    if (userData.password.length < 6) {
      throw new Error("Password must have at least 6 character");
    }
    if (await this.checkUserExist(userData.username)) {
      throw new Error("Username is exist");
    }
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create a new user with the hashed password
    const user = new userModel({
      username: userData.username,
      password: hashedPassword,
      isAdmin: false,
    });

    return await user.save();
  }

  async loginUser(username: string, password: string) {
    try {
      const user = (await userModel.findOne({ username })) as User;

      if (!user) {
        throw new Error("Incorrect username");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Incorrect password");
      }

      const token = jwt.sign({ userId: user._id }, jwtString, {
        expiresIn: "1h",
      });

      return token;
    } catch (error) {
      throw error;
    }
  }
  async verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtString, (err, decoded) => {
        if (err) {
          console.log(err);
          reject(new Error("You must login first"));
        } else {
          resolve(decoded);
        }
      });
    });
  }
  async getAuthorization(req: Request) {
    const token = req.get("Authorization");
    if (!token) {
      throw new Error("Unauthenticated");
    }
    const decoded = (await this.verifyToken(token)) as any;
    if (!decoded) {
      throw new Error("Token expired");
    }
    const user = await this.findUserById(decoded.userId);
    return user;
  }
  async getViewAuthorization(req: Request) {
    const token = getToken(req);
    if (token === undefined || token.length === 0) {
      throw new Error("Not logged in");
    }
    const decode = (await this.verifyToken(token)) as unknown as any;
    const user = await this.findUserById(decode.userId);
    return user;
  }
}

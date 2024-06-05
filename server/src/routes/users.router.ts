/**
 * Required External Modules and Interfaces
 */

import { Request, Response } from "express";
import * as express from "express";
import * as UserService from "../models/users/users.service";
import * as UserSongsService from "../models/users/songs.service";
import { HttpResponse } from "../models/httpResponses/httpResponse.interface";
import { User } from "models/users/user.interface";

/**
 * Router Definition
 */

export const UsersRouter = express.Router();

/**
 * Controller Definitions
 */

// Existing routes for adding, updating, deleting a user, etc., can also be included here
// For example:
// POST /users - Create a user
UsersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const httpResponse: HttpResponse = await UserService.addUser(user);
    res.status(httpResponse.status_code).send({
      message: httpResponse.message,
      data: httpResponse.data,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/**
 * PUT /users/:id - Update a user
 */
UsersRouter.patch("/:id", async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.id, 10);
  const updateData: Partial<User> = req.body; // Assuming only partial updates are allowed

  try {
    const httpResponse: HttpResponse = await UserService.updateUser(
      userId,
      updateData
    );
    if (httpResponse.status_code === 200) {
      res.status(200).send({
        message: httpResponse.message,
        data: httpResponse.data,
      });
    } else {
      res.status(httpResponse.status_code).send({
        message: httpResponse.message,
        data: httpResponse.data,
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// DELETE /users/:id - Delete a user
UsersRouter.delete("/:id", async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.id, 10);
  try {
    const httpResponse: HttpResponse = await UserService.deleteUser(userId);
    res.status(httpResponse.status_code).send({
      message: httpResponse.message,
      data: httpResponse.data,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

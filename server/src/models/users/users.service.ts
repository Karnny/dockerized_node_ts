import { User } from "./user.interface";
import { HttpResponse } from "../httpResponses/httpResponse.interface";

var dbPool = require("../../database/database");

export const addUser = async (newUser: User): Promise<HttpResponse> => {
  let httpResponse: HttpResponse = {
    status_code: null,
    message: "",
    data: {},
  };

  // Check if the email already exists
  let emailCheckQuery = `SELECT email FROM users WHERE email = ?`;
  let existingUser = await dbPool.query(emailCheckQuery, [newUser.email]);

  if (existingUser.length > 0) {
    httpResponse.status_code = 409; // HTTP Conflict
    httpResponse.message = "User with the given email already exists.";
    httpResponse.data = {};
    return httpResponse;
  }

  // Prepare the SQL query to insert the new user
  let insertQuery = `INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  let result = await dbPool.query(insertQuery, [newUser.name, newUser.email]);

  if (result.affectedRows === 1) {
    httpResponse.status_code = 201; // HTTP Created
    httpResponse.message = "New user added successfully.";
    httpResponse.data = {
      id: result.insertId,
      name: newUser.name,
      email: newUser.email,
    }; // Assuming the database returns the id of the new user
  } else {
    httpResponse.status_code = 500; // HTTP Internal Server Error
    httpResponse.message = "Failed to add new user.";
    httpResponse.data = {};
  }

  return httpResponse;
};

export const updateUser = async (
  userId: number,
  updateData: Partial<User>
): Promise<HttpResponse> => {
  let httpResponse: HttpResponse = {
    status_code: null,
    message: "",
    data: {},
  };

  // Check if the user exists
  let userCheckQuery = `SELECT id FROM users WHERE id = ?`;
  let existingUser = await dbPool.query(userCheckQuery, [userId]);

  if (existingUser.length === 0) {
    httpResponse.status_code = 404; // HTTP Not Found
    httpResponse.message = "User not found.";
    httpResponse.data = {};
    return httpResponse;
  }

  // Prepare the SQL query to update the user
  let fieldsToUpdate = Object.keys(updateData)
    .filter((key) => updateData[key] !== undefined && key !== "id") // Exclude 'id' from updateable fields
    .map((key) => `${key} = ?`)
    .join(", ");

  if (fieldsToUpdate.trim() === "") {
    httpResponse.status_code = 404; // HTTP Not Found
    httpResponse.message = "No data to update.";
    httpResponse.data = {};
    return httpResponse;
  }

  let queryValues = Object.values(updateData).filter(
    (value) => value !== undefined
  );
  queryValues.push(userId); // Add userId as the last parameter for WHERE clause

  let updateQuery = `UPDATE users SET ${fieldsToUpdate} WHERE id = ?`;
  let result = await dbPool.query(updateQuery, queryValues);

  if (result.affectedRows === 1) {
    httpResponse.status_code = 200; // HTTP OK
    httpResponse.message = "User updated successfully.";
    httpResponse.data = { id: userId, ...updateData };
  } else {
    httpResponse.status_code = 500; // HTTP Internal Server Error
    httpResponse.message = "Failed to update user.";
    httpResponse.data = {};
  }

  return httpResponse;
};

export const deleteUser = async (userId: number): Promise<HttpResponse> => {
  let httpResponse: HttpResponse = {
    status_code: null,
    message: "",
    data: {},
  };

  // Check if the user exists
  let userCheckQuery = `SELECT id FROM users WHERE id = ?`;
  let existingUser = await dbPool.query(userCheckQuery, [userId]);

  if (existingUser.length === 0) {
    httpResponse.status_code = 404; // HTTP Not Found
    httpResponse.message = "User not found.";
    httpResponse.data = {};
    return httpResponse;
  }

  // Prepare the SQL query to delete the user
  let deleteQuery = `DELETE FROM users WHERE id = ?`;
  let result = await dbPool.query(deleteQuery, [userId]);

  if (result.affectedRows === 1) {
    httpResponse.status_code = 200; // HTTP OK
    httpResponse.message = "User deleted successfully.";
    httpResponse.data = { id: userId }; // Optional: Return deleted userId for confirmation
  } else {
    httpResponse.status_code = 500; // HTTP Internal Server Error
    httpResponse.message = "Failed to delete user.";
    httpResponse.data = {};
  }

  return httpResponse;
};

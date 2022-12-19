const { sendResponse, AppError, IdValidator } = require("../helpers/utils.js");

const User = require("../models/User.js");
const ObjectId = require("mongoose").Types.ObjectId;

const userController = {};

//Create a user
userController.createUser = async (req, res, next) => {
  const { name, role } = req.body;
  try {
    if (!name || !role)
      throw new AppError(
        402,
        "Missing info - Create User Unsuccess",
        "Bad Request"
      );
    //mongoose query
    const created = await User.create({ name: name, role: role });
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create User Success"
    );
  } catch (err) {
    next(err);
  }
};

//Get all user
userController.getAllUsers = async (req, res, next) => {
  const allowedFilter = ["name", "role"];
  let { page, limit, ...filterQuery } = req.query;
  const { name, role } = filterQuery;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  //get all
  const filter = { isDeleted: false };
  try {
    const filterKeys = Object.keys(filterQuery);
    let offset = limit * (page - 1);

    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        throw new AppError(401, `Query ${key} is not allowed`, "Bad Request");
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (role) {
      filter.role = role;
    }
    //mongoose query
    const listOfFound = await User.find(filter);

    const response = {
      data: listOfFound.slice(offset, offset + limit),
      message: "Found list of users success",
      total_users: listOfFound.length,
      page: page,
      total_pages: Math.ceil(listOfFound.length / 10),
    };
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

//Get an user
userController.getUserById = async (req, res, next) => {
  try {
    const { targetId } = req.params;
    //check id validation
    IdValidator(targetId);

    const user = await User.findById(targetId);

    sendResponse(res, 200, true, { data: user }, null, "Get user success");
  } catch (err) {
    next(err);
  }
};

//Update a user
userController.updateUserById = async (req, res, next) => {
  const { targetId } = req.params;

  const allowedUpdate = ["name", "role"];

  const { ...updateInfo } = req.body;
  const updateKeys = Object.keys(updateInfo);

  const options = { new: true };
  try {
    //check id validation
    IdValidator(targetId);

    updateKeys.forEach((key) => {
      if (!allowedUpdate.includes(key)) {
        throw new AppError(401, `Query ${key} is not allowed`, "Bad Request");
      }
    });

    //mongoose query
    const updated = await User.findByIdAndUpdate(targetId, updateInfo, options);

    sendResponse(
      res,
      200,
      true,
      { data: updated },
      null,
      "Update user success"
    );
  } catch (err) {
    next(err);
  }
};

//Delete user
userController.deleteUserById = async (req, res, next) => {
  const { targetId } = req.params;

  //check id validation
  IdValidator(targetId);

  try {
    //mongoose query
    const updated = await User.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      { new: true }
    );

    sendResponse(
      res,
      200,
      true,
      { data: updated },
      null,
      "Delete user success"
    );
  } catch (err) {
    next(err);
  }
};

//export
module.exports = userController;

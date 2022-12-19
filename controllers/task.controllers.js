const { sendResponse, AppError, IdValidator } = require("../helpers/utils.js");

const Task = require("../models/Task.js");
const User = require("../models/User.js");
const ObjectId = require("mongoose").Types.ObjectId;

const taskController = {};

//Create a Task
taskController.createTask = async (req, res, next) => {
  const info = req.body;
  const allowedInfo = ["title", "description", "assignee"];
  try {
    //always remember to control your inputs
    if (!info || !info.title || !info.description)
      throw new AppError(400, "Create Task Error", "Bad Request");

    const infoKeys = Object.keys(info);
    infoKeys.forEach((key) => {
      if (!allowedInfo.includes(key)) {
        throw new AppError(401, `${key} is not allowed`, "Bad Request");
      }
    });

    if (info.assignee) {
      if (!Array.isArray(info.assignee)) {
        throw new AppError(401, `Assignee need to be an array`, "Bad Request");
      }
      const assignee = info.assignee;
      for (let i = 0; i < assignee.length; i++) {
        IdValidator(assignee[i]);

        const user = await User.exists({ _id: assignee[i] });

        if (!user) {
          throw new AppError(406, "User is not exist", "Bad request");
        }
      }
    }

    //mongoose query
    const created = await Task.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create Task Success"
    );
  } catch (err) {
    next(err);
  }
};

//Update Task
taskController.updateTaskById = async (req, res, next) => {
  const { taskId } = req.params;

  const allowedUpdate = ["title", "description", "status", "assignee"];

  const { ...updateInfo } = req.body;
  const updateKeys = Object.keys(updateInfo);

  const options = { new: true };
  try {
    //check task id validation
    IdValidator(taskId);

    //check update key
    updateKeys.forEach((key) => {
      if (!allowedUpdate.includes(key)) {
        throw new AppError(401, `Query ${key} is not allowed`, "Bad Request");
      }
    });

    //check assignee

    if (updateKeys == "assignee") {
      if (!Array.isArray(updateInfo["assignee"])) {
        throw new AppError(401, `Assignee need to be an array`, "Bad Request");
      }
      const assignee = updateInfo["assignee"];
      for (let i = 0; i < assignee.length; i++) {
        IdValidator(assignee[i]);

        const user = await User.exists({ _id: assignee[i] });

        if (!user) {
          throw new AppError(406, "User is not exist", "Bad request");
        }
      }
    }

    //mongoose query
    const updated = await Task.findByIdAndUpdate(
      taskId,
      updateInfo,
      options
    ).populate("assignee");

    sendResponse(
      res,
      200,
      true,
      { data: updated },
      null,
      "Update task success"
    );
  } catch (err) {
    next(err);
  }
};

//Get all Task
taskController.getAllTasks = async (req, res, next) => {
  const allowedFilter = ["title", "description", "assignee", "status"];
  let { page, limit, ...filterQuery } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const { title, description, assignee, status } = filterQuery;
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

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (description) {
      filter.description = { $regex: description, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }
    if (assignee) {
      filter.assignee = assignee;
    }

    //mongoose query
    const listOfFound = await Task.find(filter).populate("assignee");

    const response = {
      data: listOfFound.slice(offset, offset + limit),
      message: "Found list of tasks success",
      total_tasks: listOfFound.length,
      page: page,
      total_pages: Math.ceil(listOfFound.length / 10),
    };
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

//Get a task by id
taskController.getTaskById = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    //check id validation
    IdValidator(taskId);

    const task = await Task.findById(taskId);

    sendResponse(res, 200, true, { data: task }, null, "Get task success");
  } catch (err) {
    next(err);
  }
};

//Delete a task by id
taskController.deleteTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const option = { new: true };
    //check id validation
    IdValidator(taskId);

    //mongoose query
    const updated = await Task.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      option
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
module.exports = taskController;

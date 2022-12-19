const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/task.controllers.js");

//Read
/**
 * @route GET api/task
 * @description get list of tasks
 * @access public
 */
router.get("/", getAllTasks);

//Read
/**
 * @route GET api/task
 * @description get a task
 * @access public
 */
router.get("/:taskId", getTaskById);

//Create
/**
 * @route POST api/task
 * @description create atTask
 * @access public
 */
router.post("/", createTask);

//Update
/**
 * @route PUT api/task
 * @description update a task
 * @access public
 */
router.put("/:taskId", updateTaskById);

//Delete
/**
 * @route DELETE api/task
 * @description delet a task
 * @access public
 */
router.delete("/:taskId", deleteTaskById);

//export
module.exports = router;

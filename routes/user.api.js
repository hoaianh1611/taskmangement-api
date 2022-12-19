const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controllers.js");

//Read
/**
 * @route GET api/user
 * @description get list of users
 * @access public
 */
router.get("/", getAllUsers);

//Read
/**
 * @route GET api/user
 * @description get an users
 * @access public
 */
router.get("/:targetId", getUserById);

//Create
/**
 * @route POST api/user
 * @description create a user
 * @access public
 */
router.post("/", createUser);

//Update
/**
 * @route PUT api/user
 * @description update user
 * @access public
 */
router.put("/:targetId", updateUserById);

//Delete
/**
 * @route delete api/user
 * @description delete an user
 * @access public
 */
router.delete("/:targetId", deleteUserById);

//export
module.exports = router;

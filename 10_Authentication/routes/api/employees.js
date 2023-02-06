const express = require('express')
const router = express.Router()
const employeesController = require('../../controllers/employeesController')
// potremmo fare un destructuring {getAllEmployees, ...} = require('....')


router.route('/')
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee)


router.route('/:id')
  .get(employeesController.getEmployee)

module.exports = router
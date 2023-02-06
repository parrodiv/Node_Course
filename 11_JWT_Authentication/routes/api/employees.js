const express = require('express')
const router = express.Router()
const employeesController = require('../../controllers/employeesController')


router.route('/')
//.get(verifyJWT, employeesController.getAllEmployees) // select one route to protect
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee)


router.route('/:id')
  .get(employeesController.getEmployee)

module.exports = router
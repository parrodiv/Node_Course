const Employee = require('../model/Employee')

const employeesGet = async () => {
  const employees = await Employee.find().exec()
  return employees
}

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find()
  if (!employees)
    return res.status(204).json({ message: 'No employees found.' })
  res.json(employees)
}

const createNewEmployee = async (req, res) => {
  if (!req.body?.firstname || !req.body?.lastname) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: 'First and last names are required' })
  }
  try {
    const { firstname, lastname } = req.body
    const newEmployee = await Employee.create({
      firstname: firstname, //firstname: firstname
      lastname: lastname,
    })

    res.status(201).json(newEmployee)
  } catch (error) {
    console.error(error)
  }
}

const updateEmployee = async (req, res) => {
  const { firstname, lastname, id } = req.body
  if (!id) return res.status(400).json({ message: 'ID parameter is required.' })

  const employee = await Employee.findById(id)
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${id} not found` })
  }

  if (firstname) {
    await Employee.updateOne(
      { _id: id },
      { $set: { firstname: firstname } }
    ).exec()
  }

  if (lastname) {
    await Employee.updateOne(
      { _id: id },
      { $set: { lastname: lastname } }
    ).exec()
  }

  // *****************ALTERNATIVA*****************
  // if (firstname) employee.firstname = firstname
  // if (lastname) employee.lastname = lastname
  // const result = await employee.save()

  const employees = await employeesGet()
  res.status(200).json(employees)
}

const deleteEmployee = async (req, res) => {
  if (!req.body?.id)
    return res.status(400).json({ message: 'Employee ID required.' })

  const { id } = req.body
  const employee = await Employee.findById(id).exec()
  if (!employee) {
    return res
      .status(204) // 204 OK with NO CONTENT
      .json({ message: `Employee ID ${id} not found` })
  }

  const result = await Employee.deleteOne({ _id: id })

  res.json(result)
}

const getEmployee = async (req, res) => {
  if(!req.params?.id) return res.status(400).json({'message': 'Employee ID required'})
  const { id } = req.params
  const employee = await Employee.findById(id).exec()
  if (!employee) {
    return res.status(204).json({ message: `No employee matches ID ${id}` })
  }

  res.json(employee)
}

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
}

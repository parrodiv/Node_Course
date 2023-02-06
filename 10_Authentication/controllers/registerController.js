const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}
const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required' })

  // check for duplicate usernames in the db
  const duplicate = usersDB.users.find((person) => person.username === user)
  if (duplicate) return res.sendStatus(409) //conflict

  // res.sendStatus is shorthand for implementing res.send and res.status
  // res.sendStatus(200); // equivalent to res.status(200).send('OK')
  // res.sendStatus(403) // equivalent to res.status(403).send('Forbidden')
  // res.sendStatus(404) // equivalent to res.status(404).send('Not Found')
  // res.sendStatus(500) // equivalent to res.status(500).send('Internal Server Error')

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 5) // 10 is salt

    // store the new user
    const newUser = {
      username: user,
      password: hashedPwd,
    }
    usersDB.setUsers([...usersDB.users, newUser])

    // update users.json file (ovewrite)
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    )

    console.log(usersDB.users)
    res.status(201).json({ success: `New user ${user} created!` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = { handleNewUser }

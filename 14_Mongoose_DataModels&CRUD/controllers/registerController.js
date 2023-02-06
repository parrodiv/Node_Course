const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
  const { user, pwd, roles } = req.body
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required' })

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec()
  if (duplicate) return res.sendStatus(409) //conflict

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10) // 10 is salt

    // create and store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
      roles
      // roles will be automatically added (see User Schema - default 2001)
    })

    // OTHER WAYS TO CREATE AND STORE
      // const newUser = new User()
      // newUser.username = ... --- newUser.password = ... other data
      // instead of dot notation (this up above) it can be possible to make this way: 
          // const newUser = new User({ username: user, password: pass})
      // const result = await newUser.save()

    console.log(result);
   
    res.status(201).json({ success: `New user ${user} created!` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = { handleNewUser }

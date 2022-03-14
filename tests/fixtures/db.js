const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'mike',
    email: 'mike@example.com',
    password: '1234567',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'jess',
    email: 'jess@example.com',
    password: '1234567',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description: '1 task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description: '2 task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description: '3 task',
    completed: true,
    owner: userTwo._id
}

const setUpDataBase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setUpDataBase
}
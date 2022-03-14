const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setUpDataBase
} = require('./fixtures/db')

beforeEach(setUpDataBase)

test('Should create task  for user', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'task 1'
        })
        .expect(201)
        const task = await Task.findById(res.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toEqual(false)
})

test('Should retrieve only user task', async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        expect(res.body.length).toEqual(2)
})


test('Should not allow a user to delete others users tasks', async () => {

    const res = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


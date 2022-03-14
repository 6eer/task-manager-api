const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setUpDataBase } = require('./fixtures/db')


beforeEach(setUpDataBase)

test('Should signup a new user', async () => {
    const res = await request(app).post('/users').send({
        name: '6eer',
        email: '6eer@example.com',
        password: '1234567'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(res.body).toMatchObject({
        user: {
            name: '6eer',
            email: '6eer@example.com'
        },
        token: user.tokens[0].token
    })

    // Assert that the password was not sased as plain text
    expect(user.password).not.toBe('1234567')
})

test('Should login an existing user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Assert that token is response matches the new token saved
    const user = await User.findById(userOneId)
    expect(res.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: '6eer',
        password: '6eer@example.com'
    }).expect(400)
})

test('Should get profile user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const res = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Me'
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Me')
})

test('Should not update invalid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'santa fe'
    })
    .expect(400)
})

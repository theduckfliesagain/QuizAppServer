describe('users endpoints', () => {
    let api;
    beforeEach(async () => {
        await resetTestDB()
    })

    beforeAll(async () => {
        api = app.listen(5000, () => console.log('Test server running on port 5000'))
    });

    afterAll(async () => {
        console.log('Gracefully stopping test server')
        await api.close()
    })

    it('should return a list of all users in database', async () => {
        const res = await request(api).get('/users')
        expect(res.body).toHaveLength(3)
    });

    it('should retrive a users based on id', async () => {
    });


    it('should create a new user ', async () => {

    });

    it('should delete a user', async () => {

    }); 
})
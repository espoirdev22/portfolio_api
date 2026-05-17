const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {

    test('GET / should return 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('GET /route-inexistante should return 404', async () => {
        const response = await request(app).get('/route-inexistante');
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

});
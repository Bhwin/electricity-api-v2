const request = require('supertest');
const app = require('../index');
describe('Electricity API Endpoints', () => {
// API 1: Total Usage (Valid)
    it('should return total electricity usage for all years', async () => {
        const res = await request(app).get('/api/usage/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
    });
// API 1: Total Usage (Invalid)
    it('should return 404 when using an unsupported HTTP method', async () => {
        const res = await request(app).post('/api/usage/total-by-year');
        expect(res.status).toBe(404);
    });

// API 2: Total User (Valid)
    it('should return a valid object mapping years to total user counts', async () => {
        const res = await request(app).get('/api/users/total-by-year');
        
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
        Object.values(res.body).forEach(count => {
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
            expect(count % 1).toBe(0);
        });
    });

// API 2: Total User (Invalid)
    it('should return 404 for a mistyped pluralization in the URL', async () => {
        const res = await request(app).get('/api/user/total-by-year'); 
        expect(res.status).toBe(404);
    });

// API 3: Usage by Province and Year (Valid)
    it('should return specific usage data for a valid province and year', async () => {
        const res = await request(app).get('/api/usage/bangkok/2566');
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('province_name');
        expect(res.body.province_name.toLowerCase()).toBe('bangkok');
        expect(String(res.body.year)).toBe('2566');
    });

// API 3: Usage by Province and Year (Invalid)
    it('should return a "Data not found" message when the province or year does not exist', async () => {
        const res = await request(app).get('/api/usage/atlantis/3000');
        expect(res.status).toBe(200); 
        expect(res.body).toEqual({ message: "Data not found" });
    });

// API 4: Users by Province and Year (Valid)
    it('should return user demographic data for a specific province and year', async () => {
        const res = await request(app).get('/api/users/phuket/2566');
        
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('province_name');
        expect(res.body.province_name.toLowerCase()).toBe('phuket');
        expect(String(res.body.year)).toBe('2566');
    });

// API 4: Users by Province and Year (Invalid)
    it('should return electricity usage for a specific province and year', async () => {
        const res = await request(app).get('/api/usage/Alberta/2566');
        expect(res.body.message).toBe('Data not found');
    });

// API 5: Usage history for a specific province (Valid)
    it('should return an array of historical usage data for a valid province', async () => {
        const res = await request(app).get('/api/pastusagehistory/chiang mai');
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach(record => {
            expect(record).toHaveProperty('province_name');
            expect(record.province_name.toLowerCase()).toBe('chiang mai');
        });
    });

// API 5: Usage history for a specific province (Invalid)
    it('should return an empty array when querying history for a non-existent province', async () => {
        const res = await request(app).get('/api/pastusagehistory/hogwarts');
        expect(res.status).toBe(200); 
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
        expect(res.body).toEqual([]);
    });

// API 6: User history for a specific province (Valid)
    it('should return total electricity users for all years', async () => {
        const res = await request(app).get('/api/pastusershistory/Bangkok');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

// API 6: User history for a specific province (Invalid)
    it('should return an empty array when querying user history for a non-existent province', async () => {
        const res = await request(app).get('/api/pastusershistory/narnia');
        expect(res.status).toBe(200); 
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
        expect(res.body).toEqual([]);
    });
});

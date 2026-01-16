const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000"

const axios = {
    post: async (...args) => {
        try {
            const res = await axios2.post(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    get: async (...args) => {
        try {
            const res = await axios2.get(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    put: async (...args) => {
        try {
            const res = await axios2.put(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    delete: async (...args) => {
        try {
            const res = await axios2.delete(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
}

describe("Authentication", () => {
    test('User is able to sign up only once', async () => {
        const username = "Navan" + Math.random(); // kirat0.12331313
        const password = "123456";
        const email= "navan" + Math.random() + "@gmail.com";
        const response = await axios.post(`${BACKEND_URL}/user/signup`, {
            username,
            email,
            password,
    
        })

        expect(response.status).toBe(200)
        const updatedResponse = await axios.post(`${BACKEND_URL}/user/signup`, {
            username,
            password,
            email,
        })

        expect(updatedResponse.status).toBe(400);
    });

    test('Signin succeeds if the username and password are correct', async() => {
        const username = `kirat-${Math.random()}`
        const email= "navan" + Math.random() + "@gmail.com";
        const password = "123456"

        await axios.post(`${BACKEND_URL}/user/signup`, {
            username,
            password,
            email
        });

        const response = await axios.post(`${BACKEND_URL}/user/login`, {
            email,
            password
        });

        expect(response.status).toBe(200)
        expect(response.data.token).toBeDefined()
        
    })

    test('Signin fails if the username and password are incorrect', async() => {
        const username = `kirat-${Math.random()}`
        const password = "123456"
        const email= "navan" + Math.random() + "@gmail.com";

        await axios.post(`${BACKEND_URL}/user/signup`, {
            username,
            password,
            email
        });

        const response = await axios.post(`${BACKEND_URL}/user/login`, {
            email: "WrongUsername",
            password
        })

        expect(response.status).toBe(403)
    })

})


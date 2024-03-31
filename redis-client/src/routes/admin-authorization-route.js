import express from 'express';
import controller from '../../controller/admin-controllers/login-controller.js'

const app = express();

// POST request for Adminn Login.
app.post("/login:id", controller.login_post);

export default app;
import express from "express";
import cors from "cors";
import connectDb from "./database.js";
import setup from "./src/controllers/routes.js";

const app = express();
app.use(express.json());
app.use(cors());

connectDb().then(() => {
    setup(app);
    const host = "localhost";
    const port = 8000;
    app.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    })
})

export default app;
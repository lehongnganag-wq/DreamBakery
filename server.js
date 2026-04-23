require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

app.listen(3000, () => {
	console.log('Server is running at http://127.0.0.1:3000');
});
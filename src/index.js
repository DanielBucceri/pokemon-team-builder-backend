const {app, PORT} = require("./server.js");

app.listen(PORT, () => {
	console.log("Server is running on port " + process.env.PORT);
});

module.exports = {
	app: app
}
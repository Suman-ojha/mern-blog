var mongoose = require("mongoose");

// const mongoDBUrl = `mongodb://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const mongoDBUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}/${process.env.DB_NAME}`;
mongoose.Promise = global.Promise;


mongoose
	.connect(mongoDBUrl, {
		// useUnifiedTopology: true,
		// useNewUrlParser: true,
		// useFindAndModify: false,
		// useCreateIndex: true,
	})
	.then(() => console.log("Database Connected at " + mongoDBUrl))
	.catch((error) => console.log(error));

module.exports = mongoose;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { DbConnection } = require("./utils/db");
const { notFound } = require("./utils/not-found.js");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

//Db connection
DbConnection();
//------------------------------------------------------------------//

//Middlewares
app.use("/images", express.static("./assets/images")); // for get images by useing /images after website link
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTENDURI, process.env.AdminPanelURI],
    credentials: true,
  })
);
app.use(morgan("dev"));
//------------------------------------------------------------------//

//Routes
app.use("/api/v2/auth", require("./routes/auth.route.js"));
app.use("/api/v2/user", require("./routes/user.route.js"));
app.use("/api/v2/product", require("./routes/product.route.js"));
app.use("/api/v2/blogCategory", require("./routes/blogCategory.route.js"));
app.use("/api/v2/blog", require("./routes/blog.route.js"));
app.use("/api/v2/category", require("./routes/category.route.js"));
app.use("/api/v2/subcategory", require("./routes/subCategory.route.js"));
app.use("/api/v2/brand", require("./routes/brand.route.js"));
app.use("/api/v2/order", require("./routes/order.route.js"));
app.use("/api/v2/color", require("./routes/color.route.js"));
app.use("/api/v2/enquiry", require("./routes/enquiry.route.js"));
app.use("/api/v2/coupon", require("./routes/coupon.route.js"));
app.use("/api/v2/cart", require("./routes/cart.route.js"));
app.use("/api/v2/payment", require("./routes/payment.route.js"));

//------------------------------------------------------------------//

//Not found
app.all(notFound);

//------------------------------------------------------------------//

//Error
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    error: err,
    message: err.message,
    stack: err.stack,
  });
});

//------------------------------------------------------------------//

//Server is working
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The server is worrking on port : ${port}`);
});

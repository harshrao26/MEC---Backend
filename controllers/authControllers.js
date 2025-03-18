const adminModel = require("../models/adminModel.js");
const { responseReturn } = require("../utils/response.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/tokenCreate.js");
const sellerModel = require("../models/sellerModel.js");
const seller_customer = require("../models/chat/sellerCustomerModel.js");
class authControllers {
  admin_login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
      const admin = await adminModel.findOne({ email }).select("+password");

      if (!admin) {
        return responseReturn(res, 400, { error: "Invalid Credentials" });
      }

      const comparePassword = await bcrypt.compare(password, admin.password);
      if (!comparePassword) {
        return responseReturn(res, 400, { error: "Invalid Credentials" });
      }

      const token = await createToken({
        id: admin._id,
        role: admin.role,
      });

      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
      });

      return responseReturn(res, 200, { token, message: "Login Successful!" });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  seller_register = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    try {
      const getUser = await sellerModel.findOne({ email });

      if (getUser) {
        return responseReturn(res, 400, { error: "Email already exists" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // FIXED: Added salt rounds
        const seller = await sellerModel.create({
          name,
          email,
          password: hashedPassword, // Use the hashed password
          method: "manual", // Fixed typo from "menualy" to "manual"
          shopInfo: {},
        });
        await seller_customer.create({
          myId: seller._id,
          myFriendsId: [], // Initialize an empty array for friends. This will be used for managing user's friend list.
        });

        const token = await createToken({
          id: seller._id,
          role: seller.role,
        });

        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 604800000), // 1 week
          httpOnly: true,
        });

        responseReturn(res, 201, {
          token,
          message: "Seller created successfully",
        });

        console.log(seller);
      }
    } catch (error) {
      console.error(error);
    }
  };
  seller_login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select("+password");
      if (!seller) {
        return responseReturn(res, 400, { error: "Invalid Credentials" });
      }
      const comparePassword = await bcrypt.compare(password, seller.password);
      if (!comparePassword) {
        return responseReturn(res, 400, { error: "Invalid Credentials" });
      }
      const token = await createToken({
        id: seller._id,
        role: seller.role,
      });
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 604800000), // 1 week
        httpOnly: true,
      });
      return responseReturn(res, 200, { token, message: "Login Successful!" });
      console.log(seller);
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id).select("-password");
        return responseReturn(res, 200, { user });
      } else {
        const seller = await sellerModel.findById(id).select("-password");
        return responseReturn(res, 200, { seller });
      }
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
}

module.exports = new authControllers();

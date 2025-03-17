const adminModel = require("../models/adminModel.js");
const { responseReturn } = require("../utils/response.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/tokenCreate.js");

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

  getUser = async (req, res) => {
    const {id, role} = req;

    try {
      if(role === "admin") {
        const user = await adminModel.findById(id).select("-password");
        return responseReturn(res, 200, {user});
        
      }
      else{
        console.log("Seller Info")
      }

    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, {error: "Internal Server Error"});
    }
  };
}

module.exports = new authControllers();


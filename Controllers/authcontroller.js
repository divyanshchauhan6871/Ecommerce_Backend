import { compare_password, hashpassword } from "../Helpers/authhelper.js";
import usermodel from "../Models/userModel.js";
import userModels from "../Models/userModel.js";
import ordermodel from "../Models/OrderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // validating user
    if (!name) {
      res.send({ error: "name is required" });
    }
    if (!email) {
      res.send({ error: "email is required" });
    }
    if (!password) {
      res.send({ error: "password is required" });
    }
    if (!phone) {
      res.send({ error: "phone is required" });
    }
    if (!address) {
      res.send({ error: "address is required" });
    }
    if (!answer) {
      res.send({ error: "answer is required" });
    }
    // checking for the unique user
    const existinguser = await userModels.findOne({ email: email });
    if (existinguser) {
      return res.status(200).send({
        success: true,
        message: "Already registered please login",
      });
    }

    const hashedpassword = await hashpassword(password);
    const newuser = await new userModels({
      name: name,
      email: email,
      password: hashedpassword,
      phone: phone,
      address: address,
      answer: answer,
    }).save();

    res.status(200).send({
      success: true,
      message: "User have registered succesfully",
      user: newuser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error: error,
    });
  }
};

export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.send(404).send({
        success: false,
        message: "Wrong email or password",
      });
    }
    const user = await userModels.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User is not registered",
      });
    }
    const match = await compare_password(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    const token = await JWT.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    res.status(200).send({
      success: true,
      message: "Login succesfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer is required",
      });
    }
    if (!newpassword) {
      res.status(400).send({
        message: "New password is required",
      });
    }
    const user = await usermodel.findOne({ email: email });
    if (!user) {
      res.status(404).send({
        message: "Wrong email or answer",
      });
    }
    if (user.answer !== answer) {
      res.status(404).send({
        message: "Wrong email or answer",
      });
    }
    const hash = await hashpassword(newpassword);
    await userModels.findOneAndUpdate(user._id, { password: hash });
    res.status(200).send({
      success: true,
      message: "Password is changed successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const testcontroller = async (req, res) => {
  res.send("Protexted route");
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;
    const user = await userModels.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({
        status: false,
        message: "Error in updatig user profile",
      });
    }
    const hashedpassword = password ? await hashpassword(password) : undefined;
    const updatedUser = await userModels.findByIdAndUpdate(
      req.user._id,
      {
        name,
        password: hashedpassword,
        phone,
        address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating user profile",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await ordermodel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({ success: true, orders: orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating user profile",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await ordermodel
      .find()
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort("-createdAt");
    res.status(200).send({ success: true, orders: orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting all orders",
      error,
    });
  }
};

export const orderStatusCOntroller = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await ordermodel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating order",
      error,
    });
  }
};

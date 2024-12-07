import productModel from "../Models/productModel.js";
import OrderModel from "../Models/OrderModel.js";
import slugify from "slugify";
import fs from "fs";
import categoryModel from "../Models/categoryModel.js";
import dotenv from "dotenv";
import braintree from "braintree";

dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name) {
      return res
        .status(500)
        .send({ success: false, message: "name is missing in the input" });
    }
    if (!description) {
      return res.status(500).send({
        success: false,
        message: "description is missing in the input",
      });
    }
    if (!price) {
      return res
        .status(500)
        .send({ success: false, message: "price is missing in the input" });
    }
    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "category is missing in the input" });
    }
    if (!quantity) {
      return res
        .status(500)
        .send({ success: false, message: "quantity is missing in the input" });
    }
    if (!shipping) {
      return res
        .status(500)
        .send({ success: false, message: "shipping is missing in the input" });
    }
    if (photo && photo.size > 1000000) {
      return res.status(500).send({
        success: false,
        message: "photo uploaded is very big in size",
      });
    }
    const product = productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res
      .status(200)
      .send({ success: true, message: "product is created", product });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "not added",
      error: error.message,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "error in getting all products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "error in getting all products",
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "error in getting product photo",
      error: error.message,
    });
  }
};

export const deleteProductCOntroller = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "The product is deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "error in getting product photo",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res
        .status(500)
        .send({ success: false, message: "name is missing in the input" });
    }
    if (!description) {
      return res.status(500).send({
        success: false,
        message: "description is missing in the input",
      });
    }
    if (!price) {
      return res
        .status(500)
        .send({ success: false, message: "price is missing in the input" });
    }
    if (!category) {
      return res
        .status(500)
        .send({ success: false, message: "category is missing in the input" });
    }
    if (!quantity) {
      return res
        .status(500)
        .send({ success: false, message: "quantity is missing in the input" });
    }
    if (photo && photo.size > 1000000) {
      return res.status(500).send({
        success: false,
        message: "photo uploaded is very big in size",
      });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res
      .status(200)
      .send({ success: true, message: "product is created", product });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "not updated",
      error: error.message,
    });
  }
};

export const handleProductFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "no filter applied",
      error: error.message,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.status(200).send({
      success: true,
      results: results,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "not searched",
      error: error.message,
    });
  }
};

export const relatedProductCOntroller = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(5)
      .populate("category");
    res.status(200).send({
      status: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "not found related data",
      error: error.message,
    });
  }
};

export const categoryWiseProductsController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.category });
    const products = await productModel
      .find({ category: category._id })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "no products fetched from this category",
      error: error.message,
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
  }
};

//payment
export const braintreePaymentCOntroller = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {}
};

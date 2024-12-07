import categoryModel from "../Models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category already exists",
      });
    }
    const category = new categoryModel({
      name,
      slug: slugify(name),
    });

    await category.save();

    res.status(201).send({
      success: true,
      message: "New category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while creating the category",
    });
  }
};

// export const updateCategoryController = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const { id } = req.params;
//     const category = await categoryModel.findByIdAndUpdate(
//       id,
//       { name, slug: slugify(name) },
//       { new: true }
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: "Error occurred while updating the category",
//       category,
//     });
//   }
// };

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while updating the category",
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.status(200).send({
      success: true,
      message: "all categories are fetched",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message:
        "Error occurred in getting all categories while updating the category",
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Get a single category",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while updating the category",
    });
  }
};

// export const deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await categoryController.findByIdAndDelete(id);
//     res.status(200).send({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: "Error occurred while updating the category",
//     });
//   }
// };

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from URL parameters
    const category = await categoryModel.findByIdAndDelete(id); // Delete category by ID

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
      category, // Optionally return the deleted category data
    });
  } catch (error) {
    console.error("Error while deleting category:", error);
    res.status(500).send({
      success: false,
      message: "Error occurred while deleting the category",
      error: error.message,
    });
  }
};

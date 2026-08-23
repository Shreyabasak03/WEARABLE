const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/ProductController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();



// PRODUCT ROUTES

// GET ALL PRODUCTS
// PUBLIC / USER


router.get("/", getAllProducts);

// GET SINGLE PRODUCT
// PUBLIC / USER


router.get("/:id", getProductById);


// CREATE PRODUCT
// ADMIN ONLY

router.post(
  "/",
  adminAuth,
  createProduct
);

// UPDATE PRODUCT
// ADMIN ONLY


router.put(
  "/:id",
  adminAuth,
  updateProduct
);

// DELETE PRODUCT
// ADMIN ONLY


router.delete(
  "/:id",
  adminAuth,
  deleteProduct
);


module.exports = router;
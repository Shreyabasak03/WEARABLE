import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    brand: "",
    image: "",
    stock: "",
    sizes: [],
    colors: [],
    discountPercentage: "",
    isActive: true,
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // ADD SIZE
  // ==========================================

  const addSize = () => {
    const size = sizeInput.trim();

    if (!size) return;

    if (formData.sizes.includes(size)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, size],
    }));

    setSizeInput("");
  };

  // ==========================================
  // REMOVE SIZE
  // ==========================================

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter(
        (size) => size !== sizeToRemove
      ),
    }));
  };

  // ==========================================
  // ADD COLOR
  // ==========================================

  const addColor = () => {
    const color = colorInput.trim();

    if (!color) return;

    if (formData.colors.includes(color)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, color],
    }));

    setColorInput("");
  };

  // ==========================================
  // REMOVE COLOR
  // ==========================================

  const removeColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter(
        (color) => color !== colorToRemove
      ),
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.image ||
      !formData.stock
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        image: formData.image.trim(),
        stock: Number(formData.stock),
        sizes: formData.sizes,
        colors: formData.colors,
        discountPercentage: Number(
          formData.discountPercentage || 0
        ),
        isActive: formData.isActive,
      };

      const response = await axios.post(
        "http://localhost:5001/api/products",
        productData
      );

      // console.log(
      //   "Product created:",
      //   response.data
      // );

      setSuccess("Product added successfully!");

      // Wait briefly so admin can see success message
      setTimeout(() => {
        navigate("/products");
      }, 800);

    } catch (err) {
      console.error(
        "Failed to create product:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      {/* HEADER */}

      <div className="add-product-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>

          <h1>Add Product</h1>

          <p>
            Add a new product to your store.
          </p>
        </div>

      </div>


      {/* FORM */}

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <div className="form-card">

          <div className="form-card-header">
            <h2>Basic Information</h2>

            <p>
              Enter the main details of your product.
            </p>
          </div>


          <div className="form-grid">

            {/* NAME */}

            <div className="form-group full-width">

              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Classic Oversized T-Shirt"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group full-width">

              <label>
                Description *
              </label>

              <textarea
                name="description"
                rows="5"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={handleChange}
              />

            </div>


            {/* PRICE */}

            <div className="form-group">

              <label>
                Price (₹) *
              </label>

              <input
                type="number"
                name="price"
                min="0"
                placeholder="999"
                value={formData.price}
                onChange={handleChange}
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Men">
                  Men
                </option>

                <option value="Women">
                  Women
                </option>

                <option value="Children">
                  Children
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>

            </div>


            {/* BRAND */}

            <div className="form-group">

              <label>
                Brand
              </label>

              <input
                type="text"
                name="brand"
                placeholder="Wearable"
                value={formData.brand}
                onChange={handleChange}
              />

            </div>


            {/* STOCK */}

            <div className="form-group">

              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                placeholder="50"
                value={formData.stock}
                onChange={handleChange}
              />

            </div>


            {/* DISCOUNT */}

            {/* <div className="form-group">

              <label>
                Discount (%)
              </label>

              <input
                type="number"
                name="discountPercentage"
                min="0"
                max="100"
                placeholder="10"
                value={
                  formData.discountPercentage
                }
                onChange={handleChange}
              />

            </div> */}


            {/* IMAGE */}

            <div className="form-group full-width">

              <label>
                Image URL *
              </label>

              <input
                type="url"
                name="image"
                placeholder="https://example.com/product.jpg"
                value={formData.image}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>


        {/* SIZES */}

        <div className="form-card">

          <div className="form-card-header">

            <h2>Sizes</h2>

            <p>
              Add available sizes for this product.
            </p>

          </div>


          <div className="tag-input">

            <input
              type="text"
              placeholder="e.g. M"
              value={sizeInput}
              onChange={(e) =>
                setSizeInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSize();
                }
              }}
            />

            <button
              type="button"
              onClick={addSize}
            >
              <Plus size={16} />
              Add
            </button>

          </div>


          <div className="tags">

            {formData.sizes.map((size) => (

              <span
                className="tag"
                key={size}
              >
                {size}

                <button
                  type="button"
                  onClick={() =>
                    removeSize(size)
                  }
                >
                  <X size={13} />
                </button>

              </span>

            ))}

          </div>

        </div>


        {/* COLORS */}

        <div className="form-card">

          <div className="form-card-header">

            <h2>Colors</h2>

            <p>
              Add available colors for this product.
            </p>

          </div>


          <div className="tag-input">

            <input
              type="text"
              placeholder="e.g. Black"
              value={colorInput}
              onChange={(e) =>
                setColorInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor();
                }
              }}
            />

            <button
              type="button"
              onClick={addColor}
            >
              <Plus size={16} />
              Add
            </button>

          </div>


          <div className="tags">

            {formData.colors.map((color) => (

              <span
                className="tag"
                key={color}
              >
                {color}

                <button
                  type="button"
                  onClick={() =>
                    removeColor(color)
                  }
                >
                  <X size={13} />
                </button>

              </span>

            ))}

          </div>

        </div>


        {/* STATUS */}

        <div className="form-card">

          <div className="status-row">

            <div>
              <h2>Product Status</h2>

              <p>
                Active products will be visible
                to customers.
              </p>
            </div>


            <label className="switch">

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>


        {/* MESSAGES */}

        {error && (
          <div className="form-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="form-message success">
            {success}
          </div>
        )}


        {/* ACTIONS */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="save-product-button"
            disabled={loading}
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddProduct;
import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Package,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

import "./Products.css";

const Products = () => {
  const [search, setSearch] = useState("");

  const products = [
    {
      id: 1,
      name: "Classic Oversized T-Shirt",
      category: "Men",
      price: 799,
      stock: 42,
      status: "Active",
    },
    {
      id: 2,
      name: "Premium Denim Jacket",
      category: "Men",
      price: 2499,
      stock: 18,
      status: "Active",
    },
    {
      id: 3,
      name: "Women's Casual Sneakers",
      category: "Women",
      price: 1899,
      stock: 7,
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Slim Fit Cargo Pants",
      category: "Men",
      price: 1299,
      stock: 25,
      status: "Active",
    },
    {
      id: 5,
      name: "Minimal Crossbody Bag",
      category: "Accessories",
      price: 999,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 6,
      name: "Oversized Hoodie",
      category: "Women",
      price: 1599,
      stock: 12,
      status: "Active",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      {/* Header */}

      <div className="products-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage your store products and inventory.
          </p>
        </div>

        <button className="add-product-button">
          <Plus size={18} />

          Add Product
        </button>

      </div>


      {/* Products Card */}

      <div className="products-card">

        {/* Toolbar */}

        <div className="products-toolbar">

          <div className="product-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          <div className="product-filters">

            <select>
              <option>All Categories</option>
              <option>Men</option>
              <option>Women</option>
              <option>Accessories</option>
            </select>

            <select>
              <option>All Status</option>
              <option>Active</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>

          </div>

        </div>


        {/* Products Table */}

        <div className="products-table-wrapper">

          <table className="products-table">

            <thead>

              <tr>

                <th>Product</th>

                <th>Category</th>

                <th>Price</th>

                <th>Stock</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  {/* Product */}

                  <td>

                    <div className="product-info">

                      <div className="product-image">

                        <Package size={20} />

                      </div>

                      <div>

                        <h4>
                          {product.name}
                        </h4>

                        <span>
                          ID: #{product.id}
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* Category */}

                  <td>
                    <span className="category-text">
                      {product.category}
                    </span>
                  </td>


                  {/* Price */}

                  <td>

                    <span className="product-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                  </td>


                  {/* Stock */}

                  <td>

                    <span
                      className={`stock-value ${
                        product.stock <= 5
                          ? "stock-danger"
                          : product.stock <= 10
                          ? "stock-warning"
                          : ""
                      }`}
                    >
                      {product.stock}
                    </span>

                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={`product-status ${product.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {product.status}
                    </span>

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="product-actions">

                      <button title="View">
                        <Eye size={16} />
                      </button>

                      <button title="Edit">
                        <Edit size={16} />
                      </button>

                      <button
                        className="delete-action"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* Footer */}

        <div className="products-footer">

          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>

          <div className="pagination">

            <button disabled>
              Previous
            </button>

            <button className="active-page">
              1
            </button>

            <button>
              2
            </button>

            <button>
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Products;
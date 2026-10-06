import { useEffect, useState } from "react";

import ProductCard from "./components/ProductCard/Product-card.tsx";
import type { IProduct } from "./components/types/interface";
import AddProduct from "./components/AddProduct/AddProduct.tsx";
import EditProduct from "./components/EditProduct/EditProduct.tsx";

interface IApiProduct {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

function App() {
  // States
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] =
    useState<IProduct | null>(null);

  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState("");

  // Add Product
  const handleProductAdded = (product: IProduct) => {
    setProducts((prev) => [...prev, product]);
    setMessage("Product added successfully");
  };

  // Edit Product
  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  const handleUpdate = (updatedProduct: IProduct) => {
    const newProducts = products.map((product) => {
      if (product.id === updatedProduct.id) {
        return updatedProduct;
      }

      return product;
    });

    setProducts(newProducts);
    setEditingProduct(null);
    setMessage("Product updated successfully");
  };

  // Delete Product
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeleteError("");

    try {
      const response = await fetch(
        `https://dummyjson.com/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const newProducts = products.filter(
        (product) => product.id !== id
      );

      setProducts(newProducts);
      setMessage("Product deleted successfully");
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  // Success message timer
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  // Get Products
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://dummyjson.com/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const productsData = data.products.map(
          (product: IApiProduct) => ({
            id: product.id,
            name: product.title,
            image: product.thumbnail,
            price: product.price,
          })
        );

        setProducts(productsData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Add Product */}
        <div className="mb-8 flex justify-end">
          <AddProduct
            onProductAdded={handleProductAdded}
          />
        </div>

        {/* Success Message */}
        {message && (
          <p className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-700">
            {message}
          </p>
        )}

        {/* Delete Error */}
        {deleteError && (
          <p className="mb-4 text-red-500">
            {deleteError}
          </p>
        )}

        {/* Edit Product */}
        {editingProduct && (
          <EditProduct
            product={editingProduct}
            onUpdate={handleUpdate}
            onClose={handleCloseEdit}
          />
        )}

        {/* Loading */}
        {loading && (
          <p className="mb-6 text-center text-gray-600">
            Loading products...
          </p>
        )}

        {/* Get Error */}
        {error && (
          <p className="mb-6 text-center text-red-500">
            {error}
          </p>
        )}

        {/* Products */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
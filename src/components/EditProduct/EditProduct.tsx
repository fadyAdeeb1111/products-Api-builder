import { useState } from "react";
import type { IProduct } from "../types/interface";

interface IEditProductProps {
  product: IProduct;
  onUpdate: (product: IProduct) => void;
  onClose: () => void;
}

function EditProduct({
  product,
  onUpdate,
  onClose,
}: IEditProductProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [image, setImage] = useState(product.image);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name || !price || !image) {
      setError("Please fill all fields");
      return;
    }

    if (Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://dummyjson.com/products/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: name,
            price: Number(price),
            thumbnail: image,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();

      const updatedProduct: IProduct = {
        id: data.id,
        name: data.title,
        image: data.thumbnail,
        price: data.price,
      };

      onUpdate(updatedProduct);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-product-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <h2
            id="edit-product-title"
            className="text-2xl font-bold text-gray-800"
          >
            Edit Product
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit product"
            className="text-2xl text-gray-400 hover:text-black"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="edit-product-name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>

            <input
              id="edit-product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="edit-product-price"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Price
            </label>

            <input
              id="edit-product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="edit-product-image"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>

            <input
              id="edit-product-image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;
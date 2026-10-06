import { useState } from "react";
import type { IProduct } from "../types/interface";

interface IAddProductProps {
  onProductAdded: (product: IProduct) => void;
}

function AddProduct({ onProductAdded }: IAddProductProps) {
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

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
        "https://dummyjson.com/products/add",
        {
          method: "POST",
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
        throw new Error("Failed to add product");
      }

      const data = await response.json();

      const newProduct: IProduct = {
        id: data.id,
        name: data.title,
        image: data.thumbnail,
        price: data.price,
      };

      onProductAdded(newProduct);

      setName("");
      setPrice("");
      setImage("");
      setShowForm(false);
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
    <div className="relative mb-8 flex justify-end">
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
        aria-controls="add-product-form"
        className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        + Add Product
      </button>

      {showForm && (
        <div
          id="add-product-form"
          className="absolute right-0 top-14 z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Add Product
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Close add product form"
              className="text-2xl text-gray-400 hover:text-black"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="product-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="product-price"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Price
                </label>

                <input
                  id="product-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="product-image"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>

                <input
                  id="product-image"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Adding..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddProduct;
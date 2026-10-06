import type { IProduct } from "../types/interface";

interface IProductCardProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (id: number) => void;
}

function ProductCard({ product,onEdit,onDelete }: IProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover sm:h-44"
      />

      <div className="p-4">
        <h2 className="mb-2 line-clamp-1 text-lg font-bold text-gray-800">
          {product.name}
        </h2>

        <p className="mb-4 text-lg font-semibold text-gray-700">
          ${product.price}
        </p>
   

        <button onClick={() => onEdit(product)} className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800">
          Edit
        </button>
        <button onClick={() => onDelete(product.id)}   className="w-full rounded-lg bg-amber-950 px-4 py-2 text-white transition hover:bg-gray-800">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
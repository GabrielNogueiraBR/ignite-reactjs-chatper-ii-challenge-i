import React from "react";

import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { Product } from "../../types";

interface CartItemProps {
  product: Product
  priceFormatted: string;
  subTotal: string;
  handleProductDecrement: (product: Product) => void
  handleProductIncrement: (product: Product) => void
  handleRemoveProduct: (productId: number) => void
}

const CartItem = ({
  product,
  priceFormatted,
  subTotal,
  handleProductDecrement,
  handleProductIncrement,
  handleRemoveProduct,
}: CartItemProps): JSX.Element => {
  return (
    <tr data-testid="product">
      <td>
        <img src={product.image} alt={product.title} />
      </td>
      <td>
        <strong>{product.title}</strong>
        <span>{priceFormatted}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={product.amount <= 1}
            onClick={() => handleProductDecrement(product)}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={product.amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            onClick={() => handleProductIncrement(product)}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{subTotal}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={() => handleRemoveProduct(product.id)}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;

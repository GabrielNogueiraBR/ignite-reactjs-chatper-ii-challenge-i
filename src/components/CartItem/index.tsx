import React from "react";

import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

interface CartItemProps {
  title: string;
  image: string;
  amount: number;
  priceFormatted: string;
  subTotal: string;
}

const CartItem = ({
  title,
  image,
  amount,
  priceFormatted,
  subTotal,
}: CartItemProps): JSX.Element => {
  return (
    <tr data-testid="product">
      <td>
        <img src={image} alt={title} />
      </td>
      <td>
        <strong>{title}</strong>
        <span>{priceFormatted}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            // disabled={product.amount <= 1}
            // onClick={() => handleProductDecrement()}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            // onClick={() => handleProductIncrement()}
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
          // onClick={() => handleRemoveProduct(product.id)}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;

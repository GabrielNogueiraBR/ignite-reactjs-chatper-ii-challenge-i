import React from "react";
import { MdAddShoppingCart } from "react-icons/md";

interface CardProductProps {
  title: string;
  priceFormatted: string;
  src: string;
}

const CardProduct = ({
  title,
  priceFormatted,
  src,
}: CardProductProps): JSX.Element => {
  return (
    <li>
      <img src={src} alt={title} />
      <strong>{title}</strong>
      <span>{priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        // onClick={() => handleAddProduct(product.id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {/* {cartItemsAmount[product.id] || 0} */} 2
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  );
};

export default CardProduct;

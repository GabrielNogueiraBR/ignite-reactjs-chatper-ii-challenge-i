import React from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { ProductFormatted } from "../../types";

interface CardProductProps {
  product: ProductFormatted;
  cartItemAmount?: number;
  handleAddProduct: (productId: number) => void;
}

const CardProduct = ({
  product,
  cartItemAmount,
  handleAddProduct,
}: CardProductProps): JSX.Element => {
  return (
    <li>
      <img src={product.image} alt={product.title} />
      <strong>{product.title}</strong>
      <span>{product.priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => handleAddProduct(product.id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {cartItemAmount || 0}
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  );
};

export default CardProduct;

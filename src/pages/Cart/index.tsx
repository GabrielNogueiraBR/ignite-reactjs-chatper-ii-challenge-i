import React from "react";
import CartItem from "../../components/CartItem";

import { useCart } from "../../hooks/useCart";
import { Product } from "../../types";
import { formatPrice } from "../../util/format";
import { Container, ProductTable, Total } from "./styles";

interface ProductCartFormatted extends Product {
  priceFormatted: string;
  subTotal: string;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map<ProductCartFormatted>((product) => {
    const productFormatted: ProductCartFormatted = {
      ...product,
      priceFormatted: formatPrice(product.price),
      subTotal: formatPrice(product.price * product.amount),
    };

    return productFormatted;
  });

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      return sumTotal + product.amount * product.price;
    }, 0)
  );

  function handleProductIncrement(product: Product) {
    console.log('increment')
  }

  function handleProductDecrement(product: Product) {
    console.log('decrement')
  }

  function handleRemoveProduct(productId: number) {
    console.log('remove')
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map((product) => (
            <CartItem
              key={product.id}
              product={product}
              priceFormatted={product.priceFormatted}
              subTotal={product.subTotal}
              handleProductDecrement={handleProductDecrement}
              handleProductIncrement={handleProductIncrement}
              handleRemoveProduct={handleRemoveProduct}
            />
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;

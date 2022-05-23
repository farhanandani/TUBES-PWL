import { useCart } from "react-use-cart";




const Cart= () => {
  
  const formatRupiah = (money) => {
   return new Intl.NumberFormat('id-ID',
     { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
   ).format(money);
  }

  const {
    isEmpty,
    totalUniqueItems,
    updateItemQuantity,
    removeItem,
    cartTotal,
    items
  } = useCart();
  if (isEmpty) return <h1 className="text-center">Keranjang Masih Kosong</h1>;
  return (
    <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          <th>Kategori Layanan</th>
          <th>Nama Layanan</th>
          <th>Harga Perbarang</th>
          <th>Jumlah Barang</th>
          <th>Sub Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {items.map((item, index) => (
          <tr key={index}>
            <td>{item.category}</td>
            <td>{item.name}</td>
            <td>{formatRupiah(item.price)}</td>
            <td>
              <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}> -
              </button>
              {item.quantity}
              <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}> +
              </button>
            </td>
            <td>{formatRupiah(item.itemTotal)}</td>
            <td><button onClick={() => removeItem(item.id)}>&times;</button></td>
          </tr>
        ))
      }
      </tbody>
    </table>
      <div className="text-end"><strong>Total Harga: {formatRupiah(cartTotal)}</strong></div>
    </div>

            
    )
}

export default Cart;
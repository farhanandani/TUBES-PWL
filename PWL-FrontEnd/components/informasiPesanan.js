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
  return (
    <div className="table-responsive">
    <table className="table align-middle">
      <thead>
        <tr>
          <th>Kategori Layanan</th>
          <th>Nama Layanan</th>
          <th>Harga Perbarang</th>
          <th>Jumlah Barang</th>
          <th>Sub Total</th>
        </tr>
      </thead>
      <tbody>
      {items.map((item, index) => (
          <tr key={index}>
            <td>{item.category}</td>
            <td>{item.name}</td>
            <td>{formatRupiah(item.price)}</td>
            <td className="align-middle">
              {item.quantity}
            </td>
            <td>{formatRupiah(item.itemTotal)}</td>
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
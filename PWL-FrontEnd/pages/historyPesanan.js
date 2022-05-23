import { useSelector } from 'react-redux'
import Link from 'next/link'
import { whoami } from '../redux/actions/auth'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from "next/router";

import Layout from '../components/layout'
import style from '../styles/historyPesanan.module.css';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';


const formatRupiah = (money) => {
   return new Intl.NumberFormat('id-ID',
     { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
   ).format(money);
}

const formatTanggal = (tanggal) => {
   const event = new Date(tanggal);
   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   return event.toLocaleDateString('id-ID', options);
}

export async function getServerSideProps(ctx) {
  const { req, res, params } = ctx


  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });


  if(response.status == 401){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  else if(response.status != 401){
    const data = await response.json();
    const dataPesananCustomer = await fetch(`https://sikatboss-backend.herokuapp.com/customer/get_pesanans_costumer/${data.id}`, {     
      headers: {
        cookie: req.headers.cookie
      }
    });
    const pesanan = await dataPesananCustomer.json();
    pesanan.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return {
    props: { data, pesanan },
    };
  }  
}


const historyPesanan = ({ data, pesanan }) => {
  const dispatch = useDispatch();
  const router = useRouter();



function Items({ currentItems  }) {
  if (pesanan.length == 0 ) return <h1 className="text-center">Anda Belum Memiliki Pesanan</h1>;
  return (
    <>
      {currentItems  &&
        currentItems .map((pesanan,index)=>(
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <h5 className="card-title">Pesanan pada {formatTanggal(pesanan.createdAt)}</h5>
                    <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Metode Pembayaran</th>
                          <th>Status Pesanan</th>
                          <th>Metode Pengiriman</th>
                          <th>Total Harga</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{pesanan.metode_pembayaran}</td>
                          <td>{pesanan.status_pesanan}</td>
                          <td>{pesanan.metode_pengiriman_pesanan}</td>
                          <td>{formatRupiah(pesanan.total_harga)}</td>
                          <td><Link href={`/detailPesananCustomer/${pesanan.id}`}><a className="btn btn-secondary">Detail</a></Link></td>
                        </tr>
                      </tbody>
                    </table>
                    </div>

                  </div>
                </div> 
              ))
      }
    </>
  );
}

function PaginatedItems({ itemsPerPage }) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(pesanan.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(pesanan.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % pesanan.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
        
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
      
        renderOnZeroPageCount={null}
      />
    </>
  );
}

  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])


  return (
    <>
      <Layout>
        <div className={style.containerUtama}>

          <div className={`p-4 ${style.container_title}`}>
            <div className={`pt-2 ${style.title}`}>
              <h2 className="text-center"><strong>History Pemesanan</strong><hr/></h2>
            </div>
          </div>

          <div className={`container py-5`}>
            <PaginatedItems itemsPerPage={5} />
          </div>

        </div>
      </Layout>
    </>
  )
}

export default historyPesanan;
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { whoami } from '../redux/actions/auth'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from "next/router";

import Layout from '../components/layout'
import style from '../styles/artikel.module.css';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import parse from 'html-react-parser';


const formatTanggal = (tanggal) => {
   const event = new Date(tanggal);
   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   return event.toLocaleDateString('id-ID', options);
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const fetchArtikel = await fetch("https://sikatboss-backend.herokuapp.com/customer/get_all_artikel");
  const artikel = await fetchArtikel.json();

  if(response.status != 401){
    const data = await response.json();
    return {
    props: { data, artikel },
    };
  }
  else if(response.status == 401){
    return {
    props: { artikel },
    };
  }  
}

const Artikel = ({data, artikel}) => {
  const dispatch = useDispatch()
  const router = useRouter();



function Items({ currentItems  }) {
  if (artikel.length == 0 ) return <h1 className="text-center">Anda Belum Memiliki Pesanan</h1>;
  return (
    <>
      {currentItems  &&
        currentItems .map((artikel,index)=>(
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <h6>{formatTanggal(artikel.createdAt)}</h6>
                    <h3 className="card-title text-center">{artikel.judul_artikel}</h3>
                    <img src={artikel.url_gambar} className="img-fluid rounded mx-auto d-block my-5" alt="Gambar"/>
                    {parse(artikel.isi_artikel)}

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
    setCurrentItems(artikel.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(artikel.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % artikel.length;
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
              <h2 className="text-center"><strong>Artikel</strong><hr/></h2>
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

export default Artikel
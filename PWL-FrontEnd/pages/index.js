import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import style from '../styles/Home.module.css';
import { whoami } from '../redux/actions/auth'

import Layout from '../components/layout'


export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const fetchArtikel = await fetch("https://sikatboss-backend.herokuapp.com/customer/get_all_artikel");
  const fetchKategori = await fetch("https://sikatboss-backend.herokuapp.com/customer/get_all_kategori");
  const artikel = await fetchArtikel.json();
  const kategori = await fetchKategori.json();

  if(response.status != 401){
    const data = await response.json();
    return {
    props: { data, artikel, kategori },
    };
  }
  else if(response.status == 401){
    return {
    props: { artikel, kategori },
    };
  }  
}

const Index = ({data, artikel, kategori}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])

  return (
    <>
      <Layout>
      <div className={style.containerUtama}> 
        <div className={`pt-2 ${style.heroes}`}>
          <Image 
            src="/images/image_background.svg"
            alt="Gambar Home"
            layout="fill"
            objectFit="cover"
          />
          <div className={`ms-md-5 mb-md-5 ${style.heroes_content_container}`}>
            <div className={`p-3 ${style.heroes_text_container}`}>
              <p className={`m-0 ${style.heading_heroes}`}><strong>Laundry, Perbaikan Sepatu dan Tas Palembang</strong></p>
              <p className={`m-0 ${style.heroes_text}`}>Make Your Shoes Shiny & Look Like New Again!</p>
            </div>
            <Link href="/kontak">
              <button type="button" className={`btn btn-dark mt-md-3 p-3 ${style.heroes_button}`}>Hubungi Kami</button>
            </Link>
          </div>
        </div>

        <div className={`p-4`}>
          <div className={`pt-2`}>
            <h2 className="text-center display-6"><strong>DAFTAR LAYANAN</strong></h2>
            <p className="text-center">Toko Sikatboss.co menyediakan beberapa daftar layanan menarik.</p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-4 g-4 ms-5 me-5">
          {kategori.map((kategori, index) =>{
            if (index > 3 ) {

            }
            else{
              return <div className="col" key={index}>
                <div className="card h-100" key={index}>
                  <Image 
                  src={kategori.url_gambar}
                  width={503}
                  height={405}
                  layout="responsive"
                  className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">{kategori.nama_kategori}</h5>
                    <p className="card-text">{kategori.deskripsi}</p>
                  </div>
                  <div className="card-footer">
                    <div className="d-grid d-flex justify-content-end">
                      <button type="button" className="btn btn-outline-dark">Pesan</button>
                    </div>
                  </div>
                </div>
              </div>
            }  
          })}    
        </div>
        <div className="row my-5">
          <div className="col text-center">
            <Link href="/daftarLayanan">
              <button type="button" className={`btn btn-dark btn-lg text-center ${style.lainnya_button}`}>Layanan Lainnya</button>
            </Link>
          </div>
        </div>
        
          <div className="row py-5 center row-cols-1 row-cols-md-2 mx-4">
            <div className="col">
              <div className="d-flex flex-column bd-highlight mb-3">
                <h2 className={`display-6 ${style.prosedur_title}`}><strong>PROSEDUR PEMESANAN</strong></h2>
                <p className={`p-2 ${style.prosedur_text}`}>Masuk atau Daftarkan Akun Anda pada website Sikatboss.</p>
                <p className={`p-2 ${style.prosedur_text}`}>Lihat Daftar Layanan yang tersedia pada Sikatboss.</p>
                <p className={`p-2 ${style.prosedur_text}`}>Pilih Layanan yang sesuai dengan Kebutuhan Anda.</p>
                <p className={`p-2 ${style.prosedur_text}`}>Pesan layanan yang Anda inginkan dan lakukan pembayaran.</p>
              </div>
            </div>
            <div className="col">
              <div className={`${style.image_prosedur}`}>
                  <Image 
                    src="/images/ProsedurPemesananImage.png"
                    width={617}
                    height={359}
                    layout="responsive"
                    alt="..." />
              </div>
            </div>
          </div>
        
        <div className={`p-4`}>
          <div className={`pt-2`}>
            <h2 className="text-center display-6"><strong>LOKASI</strong></h2>
            <p className="text-center">Dapatkan Arah Lokasi Toko Kami!</p>
          </div>
        </div>

        <iframe className={`container mb-3 ${style.map}`} 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.396095260914!2d104.7855462143148!3d-2.987438940688919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b7700c4b1a7f1%3A0x34569d3ff2c2e01e!2sSikatboss.co!5e0!3m2!1sid!2sid!4v1650413519321!5m2!1sid!2sid" 
          height="450" 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>

        
      </div>
      </Layout>
    </>
  )
}

export default Index
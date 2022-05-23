import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import style from '../styles/kontak.module.css';
import { whoami } from '../redux/actions/auth';

import Layout from '../components/layout'


export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  if(response.status != 401){
    const data = await response.json();
    return {
    props: { data },
    };
  }
  else if(response.status == 401){
    return {
    props: { },
    };
  }  
}

const Kontak = ({data}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])

  return (
    <>
      <Layout>
      <div className={style.containerUtama}> 
        <div className={`p-4 ${style.container_title}`}>
          <div className={`pt-2 ${style.title}`}>
            <h2 className="text-center"><strong>KONTAK</strong><hr/></h2>
          </div>
        </div>

        <div className={`${style.body_container}`}>
          <div className={`pt-5 ps-5 ${style.body_conten}`}>
            <p>Jika Anda membutuhkan beberapa informasi, berkonsultasi, atau bertanya tentang Sikatboss.co ini, silakan Kontak Kami segera. </p>
            <p><strong>Kontak Admin</strong></p>
            <p className="mb-0">Phone &ensp;&ensp;&ensp;&nbsp;: XXXX - XXXX - XXXX</p>
            <p className="mb-0">WhatsApp : XXXX - XXXX - XXXX</p>
            <p className="mb-0">Email &ensp;&ensp;&ensp;&ensp;&nbsp;: sikatboss@gmail.com</p>
            <br/>

            <p className="mb-0">Facebook &ensp;: @SikatBoss.co</p>
            <p className="mb-0">Instagram &nbsp;: sikatboss.co</p>
            <p className="mb-0">Twitter &ensp;&ensp;&ensp;&nbsp;: sikatboss.co</p>
            <br/>
            <p className="mb-0">Anda juga dapat langsung mendatangi pusat toko kami :</p>
            <p className="mb-0"><strong>Sikatboss.co</strong></p>
            <p className="mb-0">Jalan KH. Azhari, Palembang, Indonesia.</p>
            <iframe className={`mt-3 mb-3 ${style.map}`} 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.396095260914!2d104.7855462143148!3d-2.987438940688919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b7700c4b1a7f1%3A0x34569d3ff2c2e01e!2sSikatboss.co!5e0!3m2!1sid!2sid!4v1650413519321!5m2!1sid!2sid" 
                    height="450" 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
      </Layout>
    </>
  )
}

export default Kontak
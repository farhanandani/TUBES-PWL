import Layout from '../../components/dashboard/layout'
import Script from 'next/script';

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import { whoami } from '../../redux/actions/auth';

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });


  if(response.status != 401){
    const fetchPesanan = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_pesanan", {     
    headers: {
      cookie: req.headers.cookie
    }
  });
    
    const pesanan = await fetchPesanan.json();
    const data = await response.json();
    return {
    props: { data, pesanan },
    };
  }
  else if(response.status == 401){
    return {
      redirect: {
        destination: '/dashboard/loginAdmin',
        permanent: false,
      },
    }
  }  
}

const Index = ({data}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])


  return (
    <>
      <Layout>
      	
      </Layout>
    </>
  )
}

export default Index
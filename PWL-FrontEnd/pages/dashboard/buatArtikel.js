import Layout from '../../components/dashboard/layout'

import { useEffect, useState, } from 'react'
import { useDispatch } from 'react-redux'
import Router from "next/router";
import Link from 'next/link'
import Image from 'next/image'

import { whoami } from '../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic'

var Editor = dynamic(() => import("../../components/dashboard/Editor"), {
  ssr: false
})

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
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
      redirect: {
        destination: '/dashboard/loginAdmin',
        permanent: false,
      },
    }
  }  
}

const buatArtikel = ({data}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])

  const [value, onChange] = useState("");

  return (
    <>
      <Layout>
      	<div className="container-fluid px-4">
          <h1 className="mt-4">Buat Artikel</h1>
          
          <Editor />

          
        </div>
      </Layout>   
    </>
  )
}

export default buatArtikel
import Layout from '../../../components/dashboard/layout'

import { useEffect, useState, } from 'react'
import { useDispatch } from 'react-redux'
import Router from "next/router";
import Link from 'next/link'
import Image from 'next/image'

import { whoami } from '../../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic'

var EditorEdit = dynamic(() => import("../../../components/dashboard/EditorEdit"), {
  ssr: false
})

export async function getServerSideProps(ctx) {
  const { req, res, params } = ctx
  const { idArtikel } = params;

  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });


  if(response.status != 401){

    const fetchArtikel = await fetch(`https://sikatboss-backend.herokuapp.com/dashboard/get_artikel_by_id/${idArtikel}`, {     
      headers: {
        cookie: req.headers.cookie
      }
    });

    const artikel = await fetchArtikel.json();

    const data = await response.json();
    return {
    props: { data, artikel },
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

const detailArtikel = ({data, artikel}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])


  return (
    <>
      <Layout>
      	<div className="container-fluid px-4">
          <h1 className="mt-4">Detail Artikel</h1>
          <EditorEdit dataArtikel={artikel} />  
        </div>
      </Layout>   
    </>
  )
}

export default detailArtikel
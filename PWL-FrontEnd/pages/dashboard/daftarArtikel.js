import Layout from '../../components/dashboard/layout'
import {DataTable} from "simple-datatables"
import Head from "next/head";

import { useEffect, useState, } from 'react'
import { useDispatch } from 'react-redux'
import Router from "next/router";
import Link from 'next/link'
import Image from 'next/image'

import { whoami } from '../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });


  if(response.status != 401){
    const fetchArtikel = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_artikel", {     
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

const daftarArtikel = ({data, artikel}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
    const dataTable = new DataTable("#daftarArtikel");
  }, [dispatch])

  

  return (
    <>
      <Layout>
      	<div className="container-fluid px-4">
          <h1 className="mt-4">Artikel</h1>
          <a href="/dashboard/buatArtikel" className="btn btn-lg btn-success my-3">
            <FontAwesomeIcon icon={faPlus} /> Tambah Artikel
          </a>
          <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                Daftar Artikel
            </div>
            <div className="card-body">
              <div className="table-responsive">
              <table className="table" id="daftarArtikel">
                  <thead>
                      <tr>
                          <th>Judul Artikel</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tfoot>
                      <tr>
                          <th>Judul Artikel</th>
                          <th>Action</th>
                      </tr>
                  </tfoot>
                  <tbody>
                      { 
                        artikel.map((artikel, index)=>{
                          return (
                          <tr key={index}>
                            <td>{artikel.judul_artikel}</td>
                            <td>
                              <a href={`/dashboard/detailArtikel/${artikel.id}`} type="button" className="btn btn-info mt-2 me-2" >
                                Lihat
                              </a>
                            </td>
                          </tr>
                        )})
                      }
                  </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>   
    </>
  )
}

export default daftarArtikel
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Router from "next/router";

function Editor({dataArtikel}) {
  let [loaded, setLoaded] = useState(false);
  let [isiArtikel, setIsiArtikel] = useState(dataArtikel.isi_artikel);
  let [judulArtikel, setJudulArtikel] = useState(dataArtikel.judul_artikel);
  const [selectedImage, setSelectedImage] = useState();
  const [url, setUrl] = useState(dataArtikel.url_gambar);
  const [error, setError] = useState("");


  const onChangeJudulArtikel = (e) => {
    const judulArtikel = e.target.value;
    setJudulArtikel(judulArtikel);
  };

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };


  useEffect(() => {
    setLoaded(true);
  }, []); // run on mounting


  const hapus = () => {
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/delete_artikel/${dataArtikel.id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(()=>{
      Router.push("/dashboard/daftarArtikel")
    })
  }

  const ubah = async (e) => {

    if(selectedImage && (judulArtikel != "" && isiArtikel != "")  ){
      const data = new FormData()
      data.append("file", selectedImage)
      data.append("upload_preset", "pti06_preset")
      data.append("cloud_name","dkqxlkrj5")
      await fetch("https://api.cloudinary.com/v1_1/dkqxlkrj5/image/upload",{
        method:"post",
        body: data
      })
      .then(resp => resp.json())
      .then(hasil => {
        fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_artikel/${dataArtikel.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: `judulArtikel=${judulArtikel}&isiArtikel=${isiArtikel}&urlGambar=${hasil.url}`,
          headers: 
          {
              "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      })
      .catch(err => console.log(err))
      Router.push("/dashboard/daftarArtikel")
    }
    else{
      fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_artikel/${dataArtikel.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: `judulArtikel=${judulArtikel}&isiArtikel=${isiArtikel}&urlGambar=${url}`,
        headers: 
        {
            "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(async (response)=>{
        if(response.status == 400){
          const data = await response.json();
          setError(data.errors)
        }
        else if(response.status != 400){
          Router.push("/dashboard/daftarArtikel")
        }

      })
    }

    // fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_artikel/${dataArtikel.id}`, {
    //   method: 'PUT',
    //   credentials: 'include',
    //   body: `namaLayanan=${ubahNamaLayanan}&namaKategori=${ubahNamaKategori}&deskripsi=${ubahDeskripsi}&harga=${ubahHarga}`,
    //   headers: 
    //   {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //   }
    // }).then(async (response)=>{
    //   if(response.status == 400){
    //     const data = await response.json();
    //     setError(data.errors)
    //   }
    //   else if(response.status != 400){
    //     Router.reload(window.location.pathname)
    //   }

    // })

  }

  if (loaded) {
    return (
      <>
      <div className="container my-4">
        <div className="mb-3">
          <label htmlFor="judulArtikel" className="col-form-label"><strong>Judul Artikel :</strong></label>
          <input type="text" className="form-control" value={judulArtikel} id="judulArtikel" onChange={onChangeJudulArtikel}  />
        </div>
        {error && (
          error.map((validate, index)=>{
            if(validate.judulArtikel){
              return <div className="" key={index}>
                <div className="alert alert-danger" role="alert">
                  {validate.judulArtikel}
                </div>
              </div>  
            }
          })

        )} 

        <div className="mb-3">
          <label htmlFor="gambarArtikel" className="form-label"><strong>Gambar :</strong></label>
          <input className="form-control" type="file" id="gambarArtikel" accept="image/*" onChange={imageChange} />
          {selectedImage ? 
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="gambar"
              className="img-fluid my-1"
            />
            :
            <img
              src={url}
              alt="gambar"
              className="img-fluid my-1"
            />
          }
        </div>
        <div className="mb-3">
          <label htmlFor="isiArtikel" className="col-form-label"><strong>Isi Artikel :</strong></label>
          <CKEditor
            id="isiArtikel"
            editor={ClassicEditor}
            data={isiArtikel}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              // console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {  // do something when editor's content changed
              const data = editor.getData();
              setIsiArtikel(data);
              // console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
              // console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              // console.log("Focus.", editor);
            }}
          />
        </div>
        {error && (
          error.map((validate, index)=>{
            if(validate.isiArtikel){
              return <div className="" key={index}>
                <div className="alert alert-danger" role="alert">
                  {validate.isiArtikel}
                </div>
              </div>  
            }
          })

        )} 

        <div className="d-grid d-sm-block text-center">    
          <button className="btn btn-lg btn-success mx-5 my-4" type="button" onClick={ubah} >Edit Artikel</button> 
          <button className="btn btn-lg btn-danger" type="button" onClick={hapus} >Hapus</button>        
        </div>

      </div>
      </>

    );
  } else {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      );
  }
}

export default Editor;
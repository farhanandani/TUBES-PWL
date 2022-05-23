import Link from 'next/link'
import style from '../styles/footer.module.css';


const Footer = () => {
  
  return (
    <>     
        {/*<!-- Footer -->*/}
        <footer className={`text-center text-lg-start text-dark ${style.footer}`}>
          {/*<!-- Grid container -->*/}
          <div className="p-4 pb-5">
            {/*<!-- Section: Links -->*/}
            <section className="">
              {/*<!--Grid row-->*/}
              <div className="row">
                {/*<!-- Grid column -->*/}
                <div className={`col-md-4 col-lg-4 col-xl-4 mx-auto mt-3`}>
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    SIKATBOSS.co
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut 
                    labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>© 2010 — 2020 Website Sikatboss.co</p>
                </div>
                {/*<!-- Grid column -->*/}

                <hr className="w-100 clearfix d-md-none" />
                

                {/*<!-- Grid column -->*/}
                <div className={`col-md-3 col-lg-2 col-xl-2 mt-3`}>
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Jam Operasional
                  </h6>
                  <div>
                    <p className="text-dark">Senin &nbsp;:<span className="ms-3">07.00 - 18.00</span></p>
                  </div>
                  <div>
                    <p className="text-dark">Selasa :<span className="ms-3">07.00 - 18.00</span></p>
                  </div>
                  <div>
                    <p className="text-dark">Rabu &nbsp;&nbsp;:<span className="ms-3">07.00 - 18.00</span></p>
                  </div>
                  <div>
                    <p className="text-dark">Kamis &nbsp;:<span className="ms-3">07.00 - 18.00</span></p>
                  </div>
                  <div>
                    <p className="text-dark">Jumat &nbsp;:<span className="ms-3">07.00 - 18.00</span></p>
                  </div>
                </div>

                {/*<!-- Grid column -->*/}
                <hr className="w-100 clearfix d-md-none" />


                {/*<!-- Grid column -->*/}
                <div className="col-md-4 col-lg-3 col-xl-3 mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">Hubungi Kami</h6>
                  <p><img src="/images/whatsapp.png" height="42" width="42" /> 081369991070</p>
                  <p><img src="/images/gmail.png" height="42" width="42" /> info@gmail.com</p>
                </div>
                {/*<!-- Grid column -->*/}
              </div>
              {/*<!--Grid row-->*/}
            </section>
            {/*<!-- Section: Links -->*/}

          </div>
          {/*<!-- Grid container -->*/}
        </footer>
        {/*<!-- Footer -->*/}
      
      {/*<!-- End of .container -->*/}
    </>
  )
}

export default Footer
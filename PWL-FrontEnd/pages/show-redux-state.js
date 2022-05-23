import { useSelector } from 'react-redux'
import Link from 'next/link'
import { whoami } from '../redux/actions/auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const codeStyle = {
  background: '#ebebeb',
  width: 400,
  padding: 10,
  border: '1px solid grey',
  marginBottom: 10,
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("http://localhost:8000/customer/whoami", {     
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
    props: {  },
    };
  }  
}

const ShowReduxState = ({data}) => {
  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])
  return (
    <>
      <pre style={codeStyle}>
        <code>{JSON.stringify(state, null, 4)}</code>
      </pre>
      <Link href="/">
        <a>Go Back Home</a>
      </Link>
    </>
  )
}

export default ShowReduxState
import { Link } from "react-router-dom";

import React from 'react'

const Public = () => {
  return (
    <div>Public   
        <Link to={'/login'}>Login</Link>
    </div>
  )
}

export default Public
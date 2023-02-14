import React from 'react'
import Navbar from '../navbar/Navbar'

type IProps = {
  children: React.ReactNode
}

const Layout: React.FC<IProps> = ({ children }: IProps) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default Layout

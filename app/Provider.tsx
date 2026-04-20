import Header from '@/_components/Header';
import React from 'react'
import { Toaster } from 'sonner';

function Provider( {
 children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='pt-12'>
      <Header />
      {children}
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default Provider

import React from 'react'
import { Toaster } from 'sonner';


function commonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Toaster position="bottom-center" />
      {children}

    </div>
  )
}

export default commonLayout

import React from 'react'

function commonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      
      {children}
    </div>
  )
}

export default commonLayout

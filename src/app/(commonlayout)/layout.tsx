import React from 'react'

function commonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <h1>I am layout common page</h1>
      {children}
    </div>
  )
}

export default commonLayout

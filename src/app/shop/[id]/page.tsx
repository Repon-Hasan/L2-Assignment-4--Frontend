import React from 'react'

async function shopDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>}
) {
       const { id } = await params 
  return (
  
    <div>
      <h1>my post id is:{id}</h1>
    </div>
  )
}

export default shopDetailsPage

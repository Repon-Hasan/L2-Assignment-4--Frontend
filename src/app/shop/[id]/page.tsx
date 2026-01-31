import Image from 'next/image';
import React from 'react'

async function shopDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>}
) {
       const { id } = await params 
 const res = await fetch(`http://localhost:4000/shop/${id}`, {
    cache: "no-store",
  });
   const product = await res.json();
  //console.log(result.data)
  return (
  
  <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <Image
          src={product.data.image}
          alt={product.data.name}
          width={350}
          height={350}
          className="rounded-xl"
        />
      </div>

      <h1 className="text-3xl font-bold mt-6">{product.data.name}</h1>
      <p className="text-gray-600 mt-2">{product.data.description}</p>
      <p className="text-xl font-semibold mt-4">${product.data.price}</p>
    </div>
  )
}

export default shopDetailsPage

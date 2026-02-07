import RegistrationFrom from '@/components/RegistrationFrom'
import React from 'react'
import { Suspense } from "react";
export const dynamic = "force-dynamic";
function page() {
  return (
    <div className='h-[80vh] flex justify-center items-center'>
        <Suspense fallback={null}>
    <RegistrationFrom></RegistrationFrom>
    </Suspense>
      
    </div>
  )
}

export default page

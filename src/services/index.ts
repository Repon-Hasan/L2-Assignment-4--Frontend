import { FieldValues } from "react-hook-form";
export const loginUser=async(userData: FieldValues)=>{
    try {
        const res= await fetch("http://localhost:4000/api/auth/sign-in/email",
           {
             method:"POST",
             headers:{
                "Content-Type":"application/json"
             },
             body:JSON.stringify(userData)
           }
        )  
        const result=await res.json()
        return result
    } catch (error) {
         return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
    }
}


export const registerUser=async(userData:FieldValues)=>{
    try {
    const res=await fetch("http://localhost:4000/api/auth/sign-up/email",{
         method:"POST",
         headers:{
              "Content-Type":"application/json"
         },
         body:JSON.stringify(userData)
    })
       const result=await res.json()
       console.log(result)
       return result 
    } catch (error) {
             return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
    }
}
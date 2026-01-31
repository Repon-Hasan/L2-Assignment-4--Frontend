
import { FieldValues } from "react-hook-form";
export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch("http://localhost:4000/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result.token) {
      // Store the token in localStorage
      localStorage.setItem("token", result.token);
      // Optionally, store the user object too
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};


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
       //console.log(result)
       return result 
    } catch (error) {
             return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
    }
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error("Invalid user data", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    // 1️⃣ Call backend logout
    await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    // 2️⃣ Clear frontend storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Logout failed",
    };
  }
};


// export const logOut = async () => {
//   const storeCookies = await cookies();
//   storeCookies.delete("token");
// };

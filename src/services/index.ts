
// import { FieldValues } from "react-hook-form";

import { FieldValues } from "react-hook-form";



// // export const loginUser = async (userData: FieldValues) => {
// //   try {
// //     const res = await fetch("http://localhost:4000/api/auth/sign-in/email", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(userData),
// //       credentials: "include",
// //     });

// //     const result = await res.json();

// //     // if (result.token) {
// //     //   // Store the token in localStorage
// //     //   localStorage.setItem("token", result.token);
// //     //   // Optionally, store the user object too
// //     //   localStorage.setItem("user", JSON.stringify(result.user));
// //     // }

// //     return result;
// //   } catch (error) {
// //     return {
// //       success: false,
// //       message: error instanceof Error ? error.message : "Something went wrong",
// //     };
// //   }
// // };


// export const loginUser = async (userData: FieldValues) => {
//   const res = await fetch("http://localhost:4000/api/auth/sign-in/email", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include", // 🔥 REQUIRED
//     body: JSON.stringify(userData),
//   });

//   return res.json();
// };


export const registerUser=async(userData:FieldValues)=>{
    try {
    const res=await fetch("http://localhost:4000/api/auth/sign-up/email",{
         method:"POST",
         headers:{
              "Content-Type":"application/json"
         },
         credentials: "include", // 🔥 REQUIRED
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

// // export const getCurrentUser = () => {
// //   const userStr = localStorage.getItem("user");
// //   if (!userStr) return null;

// //   try {
// //     const user = JSON.parse(userStr);
// //     return user;
// //   } catch (error) {
// //     console.error("Invalid user data", error);
// //     return null;
// //   }
// // };

// export const getCurrentUser = async () => {
//   try {
//     const res = await fetch("http://localhost:4000/api/me", {
//       method: "GET",
//       credentials: "include", // 🔥 VERY IMPORTANT
//     });

//     // Not logged in / session expired
//     if (!res.ok) {
//       return null;
//     }

//     const data = await res.json();

//     // backend sends { user: {...} }
//     return data?.user ?? null;
//   } catch (error) {
//     console.error("Failed to get current user", error);
//     return null;
//   }
// };


// export const logoutUser = async () => {
//   try {
//     // 1️⃣ Call backend logout
//     await fetch("http://localhost:4000/api/logout", {
//       method: "POST",
      
//       credentials: "include",
//     });

//     // 2️⃣ Clear frontend storage
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     return { success: true };
//   } catch (error) {
//     return {
//       success: false,
//       message: "Logout failed",
//     };
//   }
// };

// export const updateCurrentUser = async (data: { name: string }) => {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("Not authenticated");

//   const res = await fetch("http://localhost:4000/api/users/me", {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`, // 🔑 send JWT
//     },
//     body: JSON.stringify({ name: data.name }),
//   });

//   const result = await res.json();

//   if (!res.ok) throw new Error(result.message || "Failed to update profile");

//   // update localStorage
//   localStorage.setItem("user", JSON.stringify(result.data));

//   return result.data;
// };



// // export const logOut = async () => {
// //   const storeCookies = await cookies();
// //   storeCookies.delete("token");
// // };


export const loginUser = async (userData: FieldValues) => {
  const res = await fetch("http://localhost:4000/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 🔥 REQUIRED
    body: JSON.stringify(userData),
  });

  return res.json();
};

export const getCurrentUser = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/me", {
      method: "GET",
      credentials: "include", // 🔥 REQUIRED
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.user ?? null;
  } catch (error) {
    console.error("Failed to get current user", error);
    return null;
  }
};

export const updateCurrentUser = async (data: { name: string }) => {
  const res = await fetch("http://localhost:4000/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 🔥 USE COOKIE SESSION
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update profile");

  return res.json();
};

export const logoutUser = async () => {
  try {
    await fetch("http://localhost:4000/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};


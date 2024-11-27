//will have the user info
export const createAuthSlice = (set)=>(
     {
        userInfo:undefined,
        setUserInfo: (userInfo)=>set({userInfo}),
     }
)


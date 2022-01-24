export const initialState={
    user:null,
    following:[],
    followers:[]
}

export const userReducer=(state,action)=>{
    if(action.type =="USER"){
        return {
            ...state,
            user:action.payload
        }
    }
    if(action.type =="CLEAR"){
        return null
    }
    if(action.type =="UPDATE"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type =="UPDATEPIC"){
        return {
            ...state,
            user:action.payload
        }
    }

    
    return state
}

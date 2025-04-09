import server from "./server"

export default{
    token(){
        return server(`token`,)
    }
}
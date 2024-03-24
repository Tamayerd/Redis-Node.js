import userAuthorization from "../data-access-object/user.js"

export default class Authorizations{
   static async login(email, password){
        try {
           const mailControl=  await  userAuthorization.findUserByEmail(email);
           if(mailControl === true){
            const passwordControl = await userAuthorization.passwordController(password)
            if(passwordControl){
                return Promise.resolve(true);
            }
            
           }

        } catch(err) {
            return Promise.reject(false);
        }
    }
}



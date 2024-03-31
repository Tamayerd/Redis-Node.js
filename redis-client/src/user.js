import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


const JWT_SECRET = 'Server_Admin';


const password = "1";
const hashedPassword = await bcrypt.hash(password, 10); 

//Set the hash (A Redis hash is a data type that represents a mapping between a string field and a string value )

// const users = [
//     {
//         email: "Tamay1",
//         roles: "1",
//         password: `${hashedPassword}`,
//         id:"1"
//     },
//     {
//         email: "Tamay2",
//         roles: "2",
//         password: `${hashedPassword}`,
//         id:"2"
//     },  {
//         email: "Tamay3",
//         roles: "3",
//         password: `${hashedPassword}`,
//         id:"3"
//     }      
// ];

// for (let i = 0; i < users.length; i++) {
//     const user = users[i];
//     await client.hSet('user-session:9', `user${i + 1}`, JSON.stringify(user));
// }



const fields = await client.hGetAll('user-session:9' );

let parsedFields = {};

for (const [key, value] of Object.entries(fields)) {
    parsedFields[key] = JSON.parse(value);
}


export default class userAuthorization{

    static async  findUserByEmail(email) {
        for (const key in parsedFields) {
            if (parsedFields.hasOwnProperty(key)) {
              const user = parsedFields[key];
              if (user.email === email) {
                return true;
              }
            }
          }
          return Promise.reject(false); 
    }
    
    static async passwordController(password){
    
        let userSession = await client.hGetAll('user-session:9');
        const passwordSession = userSession.password;
        if( typeof(password) !== 'string' ){
            return password.toString()   
         }
        //auth kullan 
         const match = await  bcrypt.compare(password,passwordSession);
        
         if (match) {
         const {  email, password } = userSession;
    
         return jwt.sign({  email, password  }, JWT_SECRET, { expiresIn: '365d' });
       
         } else {
             return Promise.reject('wrong username or password');
         }
    
    }
    
    
}





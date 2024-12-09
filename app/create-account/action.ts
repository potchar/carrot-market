"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import {z} from "zod";

const checkPwSame = ({password, confirm_password} : {password : String, confirm_password : String}) => {
    return password === confirm_password;
}


//const usernameSchema = z.string().min(5).max(10);
const formSchema = z.object({
    username  : z.string({
        invalid_type_error : "Username must be a string!",
        required_error : "where is my username?"
    })
    .min(3, "too too short....")
    .max(10, "very loooooong")
    .transform( (username) => { return "[TEST]_" + username})
    .refine( (username) => !username.includes("potato"), "no potato!"
    ),
    email: z.string().email(),
    password : z
    .string()
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password : z.string().min(4),
}).refine(checkPwSame, {message : "pw is not same", path : ["confirm_password"]});

export async function createAccount(prevState: any, formData : FormData){
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password")
    }

    const result = formSchema.safeParse(data);
    if(!result.success){
        return result.error.flatten();
    }else{
        console.log(result);
    }
    
    

    
    
   

}
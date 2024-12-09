"use server";

import { redirect } from "next/navigation";
import validator from "validator";
import { z } from "zod";

const phoneSchema = z.string().trim().refine( (phone) => {
    return validator.isMobilePhone(phone, "ko-KR")
},  "Wrong phone format");
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState{
    token :boolean
}

export async function smsLogIn(prevState : ActionState, formData : FormData){
    const phone = formData.get("phone");
    const token = formData.get("token");
    // 토큰이 없으면, 폰번호 먼저 확인
    if(!prevState.token){
        const result = phoneSchema.safeParse(phone);
        // 폰번호가 유효하지 않으면, token 생성 안함
        if(!result.success){
            return {
                token : false,
                error : result.error.flatten()
            };
        }
        // 폰번호가 유효하면, token 생성 함
        else{
            return {token : true};
        }
    }
    // 토큰 생성 가능한 경우
    else{
        const result = tokenSchema.safeParse(token);
        if(!result.success){
            return {
                token : true,
                error : result.error.flatten(),
            };
        }else{
            redirect("/");
        }

    }
    //const phone = tokenSchema.parse(formData.get("token"));
    //console.log(typeof formData.get("token"));
    //console.log(typeof tokenSchema.parse(formData.get("token")));

}
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { createClient } from "@supabase/supabase-js";
import { env } from "process";

export default async function del(req:NextApiRequest,res:NextApiResponse) {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const {deleteType,id,uuid} = JSON.parse(req.body)
    const deletePost = await prisma.townMap2308.findFirst({
        where:{
            id:Number(id)
        }
    })
    if(deletePost?.UUID !== uuid){
        res.send("UUIDerror")
        return
    }
    if (deletePost?.image){
        const {error} = await supabase
        .storage
        .from("image")
        .remove([`/TownMap2308/${deletePost.image}`])
        if(error){
            console.log(error)
        }
    }
    if(deleteType === 0){
        await prisma.townMap2308.delete({
            where:{
                id:Number(id)
            }
        })
    }else if(deleteType === 1){
        await prisma.townMap2308.update({
            where:{
                id:Number(id)
            },
            data:{
                image:""
            }
        })
    }

    res.send("success")
}
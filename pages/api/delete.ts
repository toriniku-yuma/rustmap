import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";
import { createClient } from "@supabase/supabase-js";
import { env } from "process";

export default async function post(req:NextApiRequest,res:NextApiResponse) {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const {id,uuid} = JSON.parse(req.body)
    const deletePost = await prisma.post.findFirst({
        where:{
            id:Number(id)
        }
    })
    if(deletePost?.UUID !== uuid){
        res.send("error")
        return
    }
    if (deletePost?.image){
        const {error} = await supabase
        .storage
        .from("image")
        .remove([deletePost.image])
        if(error){
            console.log(error)
        }
    }
    await prisma.post.delete({
        where:{
            id:Number(id)
        }
    })
    res.send("success")
}
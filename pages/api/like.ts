import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";

export default async function post(req:NextApiRequest,res:NextApiResponse) {
    const {id,uuid} = JSON.parse(req.body);
    let like;
    const post = await prisma.post.findFirst({
        where:{
            id:id
        },
        select:{
            like:true
        }
    })
    if(!post){
        console.log("test")
        return res.send("error");
    }else{
        like = post.like;
    }
    if(like.includes(uuid)){
        console.log(like,uuid)
        return res.send("error");
    }else{
        const result = await prisma.post.update({
            where:{
                id:id
            },
            data:{
                like:{
                    push:uuid
                }
            }
        })
        return res.send("success")
    }
}
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";

export default async function post(req:NextApiRequest,res:NextApiResponse) {
    const {id,uuid} = JSON.parse(req.body)
    const deletePost = await prisma.memorial.findFirst({
        where:{
            id:Number(id)
        }
    })
    if(deletePost?.UUID !== uuid){
        res.send("error")
        return
    }
    await prisma.memorial.delete({
        where:{
            id:Number(id)
        }
    })
    res.send("success")
}
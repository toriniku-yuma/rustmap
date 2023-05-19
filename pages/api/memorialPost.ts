import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";
import { randomUUID } from "node:crypto";

export default async function post(req:NextApiRequest,res:NextApiResponse) {
    let {image,uuid} = JSON.parse(req.body);
    if(!uuid){
        uuid = randomUUID();
    }
    if(!image){
        return res.send(JSON.stringify({
            type:"error",
            body:"画像がありません"
        }))
    }
    const result = await prisma.memorial.create({
        data:{
            image:image,
            UUID:uuid
        }
    })
    if(result){
        res.send(JSON.stringify({
            type:"success",
            UUID:uuid
        }))
    }
}
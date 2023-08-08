import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { createClient } from "@supabase/supabase-js";
import { env } from "node:process";
import fs from "node:fs/promises"
import { randomUUID } from "node:crypto";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function post(req:NextApiRequest,res:NextApiResponse) {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const form = new formidable.IncomingForm({uploadDir:"/tmp",keepExtensions:true});
    form.parse(req,async function(err,fields,files) {
        if(err){
            console.log(err)
            res.send(JSON.stringify({
                type:"error",
                body:""
            }))
            return
        }else{
            let {name,autherName,address,description,position,UUID} = fields;
            let image:string;
            if(!fields.image){
                const imagedata = files.image as formidable.File;
                if(!imagedata){
                    res.send(JSON.stringify({
                        type:"error",
                        body:"画像がありません"
                    }))
                    return
                }
                if(imagedata.size >= 2097152){
                    res.send(JSON.stringify({
                        type:"error",
                        body:"画像サイズが2MBを超えています"
                    }))
                    return
                }
                const imageTemp = await fs.readFile(imagedata.filepath);
                const {error} = await supabase.storage
                .from("image")
                .upload(`/${imagedata.newFilename}`,imageTemp)
                if(error){
                    console.log(error)
                    res.send(JSON.stringify({
                        type:"error",
                        body:"画像のアップロードに失敗しました"
                    }))
                    return
                }
                image = imagedata.newFilename;
            }else{
                res.send(JSON.stringify({
                    type:"error",
                    body:"画像フォームに不正な入力があります"
                }))
                return
            }
            if(typeof position === "string"){
                position = JSON.parse(position)
            }
            let positionNum = [];
            if(Array.isArray(position)){
                positionNum = position.map(x=>Number(x))
            }else{
                return
            }
            if(!Array.isArray(UUID)){
                UUID = JSON.parse(UUID).value
                if(!UUID){
                    UUID = randomUUID();
                }
            }
            if(Array.isArray(UUID)){
                return
            }
            if(typeof name !== "string"||typeof address !== "string"||typeof autherName !== "string"||typeof description !== "string"){
                return
            }
            if(positionNum.every(x=>typeof x === "number")){
                const result = await prisma.post.create({
                    data:{
                        name:name,
                        address:address,
                        autherName:autherName,
                        description:description,
                        image:image,
                        position:positionNum,
                        UUID:UUID
                    }
                    
                })
                res.send(JSON.stringify({
                    type:"success",
                    body:result.id,
                    UUID:UUID
                }))
            }
        }
    })
}
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

export default async function postTownMap2308(req:NextApiRequest,res:NextApiResponse) {
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
            console.log(fields);
            console.log(files)
            let {update,userName,playerName,steamName,address,group,phoneNumber,description,SNS,position,UUID} = fields;
            let image:string;
            if(typeof fields.image !== "string"){
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
                .upload(`/TownMap2308/${imagedata.newFilename}`,imageTemp)
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
                image = fields.image as string;
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
            if(typeof userName !== "string"||typeof playerName !== "string"||typeof steamName !== "string"||typeof group !== "string"||typeof address !== "string"||typeof phoneNumber !== "string"||typeof description !== "string"||typeof SNS !== "string"){
                return
            }
            if(positionNum.every(x=>typeof x === "number")){
                let result;
                if(update){
                    result = await prisma.townMap2308.update({
                        where:{
                            id:Number(update)
                        },
                        data:{
                            userName:userName,
                            playerName:playerName,
                            steamName:steamName,
                            group:group,
                            address:address,
                            phoneNumber:phoneNumber,
                            description:description,
                            SNS:SNS,
                            image:image,
                            position:positionNum,
                            UUID:UUID
                        }   
                    })
                }else{
                    result = await prisma.townMap2308.create({
                        data:{
                            userName:userName,
                            playerName:playerName,
                            steamName:steamName,
                            address:address,
                            group:group,
                            phoneNumber:phoneNumber,
                            description:description,
                            SNS:SNS,
                            image:image,
                            position:positionNum,
                            UUID:UUID
                        }   
                    })
                }
                res.send(JSON.stringify({
                    type:"success",
                    body:result?.id,
                    UUID:UUID
                }))
            }
        }
    })
}
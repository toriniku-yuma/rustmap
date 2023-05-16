import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function post(req:NextApiRequest,res:NextApiResponse) {
    res.send(randomUUID());
}
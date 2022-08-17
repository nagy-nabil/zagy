#! /usr/bin/env node
import fs from "fs/promises";
import {isFile,isDirectory} from 'path-type';
import yargs from "yargs"
//chalk, inqurier, gradient, chalkAnimation, nanospinner
const sleep = (ms:number=2000)=>{
     new Promise((r)=> setTimeout(r,ms))
}
let main = async (filePath:string,targerPath:string,referenceSize: number):Promise<void> => {
    
    try{const content = await fs.readFile(filePath, "utf-8");
    const words = content.split("\n");
    let newCss: string[] = words.map(elmnt => {
        if (elmnt.trim().startsWith("font-size")) {
            let temp = elmnt.split(":")[1]
            if (temp !== null) {
                let val = temp.match(/\d+/);
                if (val) {
                    let newRemVal = +val[0] / referenceSize;
                    return `font-size:${newRemVal}rem;`
                } 
            }
        }
        return elmnt;
    });
    let returned= newCss.join('\n');
    try{await fs.writeFile(`${targerPath}\\output.css`,returned)}
    catch(err){
        throw new Error('Something terribly bad have happend')
    }
   
   }
    catch(err){
        throw new Error('Something wrong happend');
    }
}

async function CLI():Promise<void>{
    const {argv} = yargs(process.argv)
    console.log(argv)
    if(!("path" in argv) && !("ref"  in argv) && !("target" in argv)){
        console.log("you must type --path , --ref and --target")
    }
    else {
        if(!(typeof argv['path']==='string'||typeof argv["ref"] !=="number") || typeof argv["target"] !== "string")throw new Error("Error");
        let isfile = await isFile(argv["path"] as string);
        if(!isfile){
        throw new Error('Path is not to a file');
        }
        isfile = await isDirectory(argv["target"] as string);
        if(!isfile){
        throw new Error('target is not to a DIR');
        }
        main(argv["path"] as string, argv["target"] as string,argv['ref'] as number)
    }

}

CLI()
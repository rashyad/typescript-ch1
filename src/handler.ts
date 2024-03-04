import fs from "fs"
import path from "path"
import { YearNumber, readDataFile } from "./reader";

export async function getTopPlants(year: YearNumber, numberOfPlants: number, filter: string | null){
    
    const jsonFile = path.resolve(__dirname, `assets/data/PLNT${year}.json`);
    // if json file is no available
    if(!fs.existsSync(jsonFile)){
        await readDataFile(year)
    }

    const jsonData = fs.readFileSync(jsonFile, 'utf8')

    if(!jsonData){
        throw new Error("File not found")
    }

    let result = JSON.parse(jsonData)

    if(filter){

        result = result.filter((item: Record<string, string| number>) => item.stateAbbreviation === filter)

    }

    return {
        data: result.slice(0, numberOfPlants),
        totalCount: result.length
    }
}

export async function getTopStates(year: YearNumber, numberOfStates: number){
    
    const jsonFile = path.resolve(__dirname, `assets/data/ST${year}.json`);
    // if json file is no available
    if(!fs.existsSync(jsonFile)){
        await readDataFile(year)
    }

    const jsonData = fs.readFileSync(jsonFile, 'utf8')
    if(!jsonData){
        throw new Error("File not found")
    }
    const result = JSON.parse(jsonData)
    
    // how to handle filters here

    return {
        data: result.slice(0, numberOfStates),
        totalCount: result.length
    }
}

export async function getStateList(){
    const jsonFile = path.resolve(__dirname, `assets/data/ST.json`);
  

    const jsonData = fs.readFileSync(jsonFile, 'utf8')
    if(!jsonData){
        throw new Error("File not found")
    }
    const result = JSON.parse(jsonData)
    
    // how to handle filters here

    return {
        data: result,
        totalCount: result.length
    }
}
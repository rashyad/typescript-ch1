import xlsx from "xlsx"
import path from "path"
import fs from "fs"

export type PlantData = {
    stateAbbreviation: string
    plantName: string
    annualNetGeneration: number
    annualNetPercentage: number
    coordinates: {
        lat: number
        lon: number
    }
}

export type YearNumber = "2022" | "2021" | "2020" | "2019" | "2018"

/**
 * @description Read the grid data by year, modify, sort and save the data into json
 */
export async function readDataFile(year: YearNumber){
    return new Promise(async (resolve, reject) => {
        try {
            const filePath = path.resolve(__dirname, `assets/data/${year}.xlsx`);

            const workbook = xlsx.readFile(filePath);
            
            await readPlantData(workbook, year)

            resolve
        }catch (e){
            reject(e)
        }
        
    })
}

export async function readPlantData(workbook: xlsx.WorkBook, year: string){
    return new Promise((resolve, reject) => {
        let sheetName = ""
        switch(year.toString()) {
            case "2021":
                sheetName = "PLNT21"
                break;
            case "2020":
                sheetName = "PLNT20"
                break;
            case "2019":
                sheetName = "PLNT19"
                break;
            case "2018":
                sheetName = "PLNT18"
                break;
            default:
                sheetName = "PLNT22"
                break;
        }
      
        let records: Record<string, string | number | object>[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])
        records = records.map((records) => {
            return {
                stateAbbreviation: records["Plant state abbreviation"], 
                plantName:  records["Plant name"], 
                annualNetGeneration:  records["Plant annual net generation (MWh)"],
                coordinates: {
                    lat: records["Plant latitude"], 
                    lon: records["Plant longitude"], 
                }
            }
        })

        // remove records without Plant annual net generation (MWh)
        records = records
        .filter((record) => 
            record.annualNetGeneration !== undefined
            && record.stateAbbreviation !== "PSTATABB"
            && record.plantName !== "PNAME"
            && record.annualNetGeneration !== "PLNGENAN"
        )

        // sort records by Plant annual net generation (MWh)
        records = records
        .sort((record1, record2) => 
            (record2.annualNetGeneration as number) - (record1.annualNetGeneration as number)
        )

        const totalAnnualNetGen = records.reduce((accumulator, obj) => {
            return accumulator + Math.abs(obj.annualNetGeneration as number);
        }, 0);

        records.forEach((record) => {
            record.annualNetGeneration =  Math.abs(record.annualNetGeneration as number)
            record.annualPercentage = parseFloat(((record.annualNetGeneration / totalAnnualNetGen) * 100).toFixed(7))
        })


        // finally save into a json file
        const jsonFile = path.resolve(__dirname, `assets/data/PLNT${year}.json`);
        try {
            fs.writeFileSync(jsonFile, JSON.stringify(records)); 
            resolve
        }catch(e) {
            reject(e)
        }

    })
   
}

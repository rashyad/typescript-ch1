// src/index.js
import express, { Express, Request, Response } from "express";
import { YearNumber } from "./reader";
import { getStateList, getTopPlants, getTopStates } from "./handler";
import path from "path"


const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get("/map", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname+'/views/map.html'));
});


app.get("/plants", async (req: Request, res: Response) => {
  const urlParams = req.query
  const yearsAccepted = [
    "2022",
    "2021",
    "2020",
    "2019",
    "2019"
  ]

  let dataYear = "2022"
  let plantsNumber = 10
  let filter = null

  if(urlParams){
    if(urlParams.year){
      const year = urlParams.year as string
      if(yearsAccepted.includes(year as string)){
        dataYear = year
      }
    }

    if(urlParams.plantsNumber){
      if(/^\d+$/.test(urlParams.plantsNumber as string)){
        plantsNumber = parseInt(urlParams.plantsNumber as string)
      }
    }

    if(urlParams.filter){
      
      filter = urlParams.filter !== "None" ? urlParams.filter as string : null
      
    }
  }

  try {

    const data = await getTopPlants(dataYear as YearNumber, plantsNumber, filter)
    
    res.json({ data: data });

  }catch (e) {
    res.status(404).send("Not found.");
  }
 
});

// get state-list 
app.get("/state-list", async (req: Request, res: Response) => {
 
  try {

    const data = await getStateList()
    
    res.json({ data: data });

  }catch (e) {
    res.status(404).send("Not found.");
  }
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
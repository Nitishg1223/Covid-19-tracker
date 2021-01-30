import React, {useState,useEffect} from "react";
import {MenuItem,Select,FormControl,Card,CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import "leaflet/dist/leaflet.css";
import Map from "./Map";
import Table from "./Table";
import {sortData,prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "./App.css";


function App() {

  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("Worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:16.80746,lng:-40.4796});
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases");


  const   handleSelect= async (event) => {
    const countryCode=event.target.value;

    const apiURL=countryCode==='Worldwide'? "https://disease.sh/v3/covid-19/all":"https://disease.sh/v3/covid-19/countries/"+countryCode;
    await fetch(apiURL)
    .then(response=> response.json())
    .then((data) => {
     if(countryCode=="Worldwide")
    {
      setMapCenter([3.80746,-40.4796]);
      setMapZoom(3);
    }
     else
    {  setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);}
      setCountry(countryCode);
      setCountryInfo(data);
    });
   } //to get info of country when select from menu
  useEffect(() =>{
    const getWorldwideInfo= async() => {
      await fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
    };getWorldwideInfo();
  },[]);     //useEffect will initialise this only once when page will load first (for getting initial info on worldwide)
  useEffect(() => {
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
         const countries = data.map((country) => ({
           name:country.country,
           value:country.countryInfo.iso2
       }));
       const sortedData=sortData(data);
       setMapCountries(data);
      setCountries(countries);setTableData(sortedData);
    });
   }; getCountriesData();  //to get initial list of countriue
  },[]);
  return (
    <div className="app" id="root">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
             <FormControl className="app_dropdown">
               <Select variant="outlined" value={country} onChange={handleSelect}>
        <MenuItem value="Worldwide">Worldwide</MenuItem>
                  {countries.map(country =>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))
        }
        </Select>
             </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed={true}
            active={casesType==="cases"}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            onClick={(e) =>setCasesType("cases")}/>
        <InfoBox
          active={casesType==="recovered"}
          title="Recovered"
          total={prettyPrintStat(countryInfo.recovered)}
          cases={prettyPrintStat(countryInfo.todayRecovered)}
          onClick={(e) =>setCasesType("recovered")}/>
        <InfoBox
          isRed={true}
         active={casesType==="deaths"}
         title="Deaths"
         total={prettyPrintStat(countryInfo.deaths)}
         cases={prettyPrintStat(countryInfo.todayDeaths)}
         onClick={(e) =>setCasesType("deaths")}/>
        </div>
        <Map
        countries={mapCountries}
        center={mapCenter}
        casesType={casesType}
        zoom={mapZoom}/>
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
        <h3 className="graphHeading">Worldwide {casesType}</h3>
      <LineGraph casesType="recovered" casesType={casesType} className={"app_graph"}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

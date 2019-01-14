import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
var retrieve = function(options){
    console.log("api hit");
    console.log(options);
    var url = URI(window.path).search({
        limit: 10,
        offset: 0
    })

    return GetRecords(url);
};


var GetRecords = function(url){
    var records = fetch(url)
        .then(result => JSON.stringify(result))
        .catch(console.log);

    console.log(records);
    return records;
};




export default retrieve;

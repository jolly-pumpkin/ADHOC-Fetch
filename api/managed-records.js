import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

var retrieve = function(options){
    console.log("api hit");
    console.log(options);

    var page = options.page;

    var url = URI(window.path).search({
        limit: 10,
        offset: (page - 1)*10
    })

    return GetRecords(url, options)
};


var GetRecords = function(url, options){
    return fetch(url)
        .then(records => ProcessRecords(records, otions))
        .catch(e => console.log(e));

};

/*
{"previousPage":null,
"nextPage":2,
"ids":[1,2,3,4,5,6,7,8,9,10],
"open":[
    {"id":2,"color":"yellow","disposition":"open","isPrimary":true},
    {"id":4,"color":"brown","disposition":"open","isPrimary":false},
    {"id":6,"color":"blue","disposition":"open","isPrimary":true},
    {"id":8,"color":"green","disposition":"open","isPrimary":false},
    {"id":10,"color":"red","disposition":"open","isPrimary":true}],"
closedPrimaryCount":1};
*/
var ProcessRecords = function(records, options){
    var previousPage = options.page > 1 ? options.page - 1 : null;
    var nextPage = options.page + 1; 
    var ids = records.map(rec => rec.id);
    let filtered  = Filter(records);

    var processRecords = {
        previousPage,
        nextPage,
        ids,
        open: filtered.open,
        closedPrimaryCount: filtered.closedPrimaryCount
    };
    return JSON.stringify(processRecords);
}

var Filter = function(records){
    let closedPrimaryCount = 0;
    let open = records.reduce((filtered, item) => {
        if(item.disposition === 'open'){
            filtered.push({
                id: item.id,
                color: item.color,
                disposition: item.disposition,
                isPrimary: isPrimary
            });
        }else{
            closedPrimaryCount++;
        }
        return filtered;
    },[]);
    return {open, closedPrimaryCount}
}

export default retrieve;
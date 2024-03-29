import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
var retrieve = function(options){
    var page = GetPage(options);

    if(page > 50) {
        return new Promise((resolve, reject) => {
            resolve(
                {
                    previousPage:50,
                    nextPage:null,
                    ids:[],
                    open:[],
                    closedPrimaryCount:0
                    }
            )
            reject('API ERROR');
        });
            
    } else {
        var url = BuildURI(window.path, options);

        return fetch(url)
                    .then(response => response.json()
                        .then(data => ProcessRecords(data, page))
                        .catch(console.log))
                    .catch(console.log);
    }
};

var BuildURI = function(url, options){
    if(options === undefined){
        return URI(window.path).search({
            limit: 10,
            offset: 0,
            color: []
        });
    } else {
        var page = options.page === undefined ? 1 : options.page;
        var colors = options.colors === undefined ? [] : options.colors;
        
       return URI(url)
                .addSearch("limit",10)
                .addSearch("offset", ((page-1)*10))
                .addSearch("color[]",colors)
    }
}

var GetPage = function(options)
{
    if(options === undefined){
        return 1;
    } else {
        return  options.page === undefined ? 1 : options.page;
    }
}

var ProcessRecords = function(records, page){
    if(records.length === 0){
       return {
            previousPage:null,
            nextPage:null,
            ids:[],
            open:[],
            closedPrimaryCount:0
       };
   } else {
    var previousPage = page > 1 ? page - 1 : null;
    var nextPage = page === 50 ? null : page + 1; 
    var ids = records.map(r => r.id);
    var filtered  = Filter(records);

    var processRecords = {
        previousPage,
        nextPage,
        ids,
        open: filtered.open,
        closedPrimaryCount: filtered.closedPrimaryCount
    };
    return processRecords;
   }
};

var Filter = function(records)
{
    const primaryColors = ['red', 'yellow', 'blue'];
    var closedPrimaryCount = 0;
    var open = [];
    records.forEach(record => {
        if(record.disposition === 'open'){
            open.push({
                id: record.id,
                color: record.color,
                disposition: record.disposition,
                isPrimary: primaryColors.includes(record.color)
            })
        } else {
            if(primaryColors.includes(record.color))
                closedPrimaryCount++;
        }
    });
    return {open, closedPrimaryCount}
}
export default retrieve;
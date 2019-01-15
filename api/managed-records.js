import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

var retrieve = function(options){
    console.log("api hit");
    console.log(options);

    var page = 1;//options.page;

    var url = URI("http://localhost:3000/records").search({
        limit: 10,
        offset: (page - 1)*10
    })

    return fetch(url)
                .then(response => response.json()
                    .then(data => ProcessRecords(data)))
                    .catch(console.log)
                .catch(console.log);
};


   /*
    var previousPage = null;//options.page > 1 ? options.page - 1 : null;
    var nextPage = 2;//options.page + 1; 
    var ids = records.map(rec => rec.id);
    let filtered  = Filter(records);

    var processRecords = {
        previousPage,
        nextPage,
        ids,
        open: filtered.open,
        closedPrimaryCount: filtered.closedPrimaryCount
    };

    var j = JSON.stringify(processRecords); 
    console.log(j);
    return j;
    */


    /*
    var processRecords = {
        previousPage:null,
        nextPage:2,
        ids:[1,2,3,4,5,6,7,8,9,10],
        open:[
            {id:2,color:"yellow",disposition:"open",isPrimary:true},
            {id:4,color:"brown",disposition:"open",isPrimary:false},
            {id:6,color:"blue",disposition:"open",isPrimary:true},
            {id:8,color:"green",disposition:"open",isPrimary:false},
            {id:10,color:"red",disposition:"open",isPrimary:true}],
        closedPrimaryCount:1};
    */

var ProcessRecords = function(records){
    console.log('processing');
    //console.log(records);
    

    var previousPage = null;//options.page > 1 ? options.page - 1 : null;
    var nextPage = 2;//options.page + 1; 
    var ids = [1,2,3,4,5,6,7,8,9,10];//temp.map(rec => rec.id);
    var filtered  = Filter(records);

    var processRecords = {
        previousPage,
        nextPage,
        ids,
        open: filtered,
        closedPrimaryCount: 1
    };


    console.log('processed');
    console.log(processRecords);
    return processRecords;
};

var Filter = function(records){
    console.log("filtering");
    console.log(records);

    var primaryColors = ['red', 'yellow', 'blue'];

    var closedPrimaryCount = 0;
    var open = [];

    records.forEach(record => {
        console.log('record');
        console.log(record);
        if(record.disposition === 'open')
        {
            open.push({
                id: record.id,
                color: record.color,
                disposition: record.disposition,
                isPrimary: primaryColors.includes(record.color)
            })
        } else {
            closedPrimaryCount++;
        }
    });
    console.log('filtered');
    console.log(open);
    return open
}

export default retrieve;
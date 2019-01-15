import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

var retrieve = function(options){
    console.log("api hit");
    
   
    var params = BuildParams(options);

    if(params.page > 50)
    {
        var result = {
            previousPage:50,
            nextPage:null,
            ids:[],
            open:[],
            closedPrimaryCount:0
            };
            return result;
    } else {
        var url = URI(window.path).search({
            limit: 10,
            offset: (params.page - 1)*10
        })
    
        return fetch(url)
                    .then(response => response.json()
                        .then(data => ProcessRecords(data, params.page, params.colors)))
                        .catch(console.log)
                    .catch(console.log);
    }
};

var BuildParams = function(options)
{
    console.log(options);
    console.log(options === undefined);

    if(options === undefined)
    {
        return {
            page: 1,
            colors: null
        }
    } else {
        return {
            page: options.page === undefined ? 1 : options.page,
            colors: options.colors === undefined ? null : options.colors,
        }
    }
}

var ProcessRecords = function(records, page, colors){
    console.log('processing');
    //console.log(records);
    console.log('page: ' + page);

    var previousPage = page > 1 ? page - 1 : null;
    var nextPage = page === 50 ? null : page + 1; 
    var ids = records.map(r => r.id);
    var filtered  = FilterFactory(records, colors);

    var processRecords = {
        previousPage,
        nextPage,
        ids,
        open: filtered.open,
        closedPrimaryCount: filtered.closedPrimaryCount
    };


    console.log('processed');
    console.log(processRecords);
    return processRecords;
};

var FilterFactory = function(records, colors){
    console.log("filtering");
    console.log(records);
    
    if(colors === null )
    {
        console.log("No color");
        return FilterDisposition(records);
    } else{
        console.log("Color");
        return FilterColor(records, colors);
    }
}

var FilterDisposition = function(records)
{
    const primaryColors = ['red', 'yellow', 'blue'];
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
            if(primaryColors.includes(record.color))
                closedPrimaryCount++;
        }
    });
    console.log('filtered');
    console.log(open);
    return {open, closedPrimaryCount}
}

var FilterColor = function(records, colors)
{
    const primaryColors = ['red', 'yellow', 'blue'];
    var closedPrimaryCount = 0;
    var open = [];
    records.forEach(record => {
        console.log('record');
        console.log(record);
        if(record.disposition === 'open' && colors.includes(record.color))
        {
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
    console.log('filtered');
    console.log(open);
    return {open, closedPrimaryCount}
}



export default retrieve;
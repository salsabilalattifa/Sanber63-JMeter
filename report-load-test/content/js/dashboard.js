/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.909375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Delete Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 7"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 10"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 8"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 9"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 6"], "isController": false}, {"data": [0.5, 500, 1500, "Logout - User ke 7"], "isController": false}, {"data": [0.5, 500, 1500, "Logout - User ke 4"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 5"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 3"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 1"], "isController": false}, {"data": [1.0, 500, 1500, "[DELETE] Delete Contact"], "isController": true}, {"data": [0.95, 500, 1500, "[PUT] Update Contact"], "isController": true}, {"data": [0.5, 500, 1500, "Update User - 10"], "isController": false}, {"data": [1.0, 500, 1500, "Logout - User ke 10"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 1"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 10"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 7"], "isController": false}, {"data": [0.5, 500, 1500, "[POST] Add Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 10"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 7"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 6"], "isController": false}, {"data": [0.5, 500, 1500, "[PUT] Update Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 7"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 1"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 7"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 6"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 9"], "isController": false}, {"data": [0.9, 500, 1500, "[PATCH] Update User"], "isController": true}, {"data": [1.0, 500, 1500, "Get User Profile - 8"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 7"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 6"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List By ID "], "isController": true}, {"data": [0.0, 500, 1500, "Login User - 10"], "isController": false}, {"data": [0.9, 500, 1500, "[GET] User Profile"], "isController": true}, {"data": [0.5, 500, 1500, "Login User - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 10"], "isController": false}, {"data": [0.5, 500, 1500, "Login User - 3"], "isController": false}, {"data": [0.5, 500, 1500, "Login User - 4"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 10"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 2"], "isController": false}, {"data": [0.5, 500, 1500, "Login User - 7"], "isController": false}, {"data": [0.5, 500, 1500, "Login User - 8"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 5"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 6"], "isController": false}, {"data": [0.5, 500, 1500, "Get User Profile - 4"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 2"], "isController": false}, {"data": [0.5, 500, 1500, "Get User Profile - 1"], "isController": false}, {"data": [0.95, 500, 1500, "[POST] Add Contact"], "isController": true}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 9"], "isController": false}, {"data": [0.5, 500, 1500, "Update User - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 2"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 4"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 5"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 6"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 7"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List"], "isController": true}, {"data": [1.0, 500, 1500, "Delete Contact - 10"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 0, 0.0, 505.00000000000017, 254, 2477, 302.0, 1298.6000000000004, 1602.8500000000006, 2477.0, 9.803921568627452, 9.257557189542483, 5.85660913671024], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Contact - 5", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 1.7704586330935252, 1.4543053057553958], "isController": false}, {"data": ["Delete Contact - 4", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 1.9901761517615177, 1.6434832317073171], "isController": false}, {"data": ["Delete Contact - 7", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 2.694457116788321, 2.2133040602189777], "isController": false}, {"data": ["Delete Contact - 6", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.5283604452054798, 2.076867508561644], "isController": false}, {"data": ["Delete Contact - 1", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 1.9791666666666667, 1.6171875], "isController": false}, {"data": ["Delete Contact - 3", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 2.650669642857143, 2.1658761160714284], "isController": false}, {"data": ["Delete Contact - 2", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 1.9791666666666667, 1.6171875], "isController": false}, {"data": ["[PUT] Update Contact - 10", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 3.8071784420289854, 3.3542798913043477], "isController": false}, {"data": ["Logout - User ke 8", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 2.41937852443609, 2.0045230263157894], "isController": false}, {"data": ["Logout - User ke 9", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 2.268256870567376, 1.8907912234042554], "isController": false}, {"data": ["Logout - User ke 6", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 1.932596659159159, 1.6012105855855856], "isController": false}, {"data": ["Logout - User ke 7", 1, 0, 0.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 0.6252672898338222, 0.5212151759530792], "isController": false}, {"data": ["Logout - User ke 4", 1, 0, 0.0, 886.0, 886, 886, 886.0, 886.0, 886.0, 886.0, 1.128668171557562, 0.7263596924379232, 0.6018093961625283], "isController": false}, {"data": ["Delete Contact - 9", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 2.699908088235294, 2.2295783547794117], "isController": false}, {"data": ["Delete Contact - 8", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 2.734375, 2.24609375], "isController": false}, {"data": ["Logout - User ke 5", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.386747901119403, 1.9895638992537312], "isController": false}, {"data": ["Logout - User ke 2", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.1905768407534247, 1.8260380993150687], "isController": false}, {"data": ["Logout - User ke 3", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 2.43406367481203, 2.0045230263157894], "isController": false}, {"data": ["Logout - User ke 1", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.1905768407534247, 1.8260380993150687], "isController": false}, {"data": ["[DELETE] Delete Contact", 10, 0, 0.0, 319.6, 270, 417, 286.0, 412.8, 417.0, 417.0, 2.0907380305247756, 1.5443693811415429, 1.2679182782772318], "isController": true}, {"data": ["[PUT] Update Contact", 10, 0, 0.0, 399.90000000000003, 275, 1232, 297.0, 1151.1000000000004, 1232.0, 1232.0, 2.0802995631370917, 2.203004732681506, 1.9405294362388181], "isController": true}, {"data": ["Update User - 10", 1, 0, 0.0, 1152.0, 1152, 1152, 1152.0, 1152.0, 1152.0, 1152.0, 0.8680555555555555, 0.72479248046875, 0.5518595377604167], "isController": false}, {"data": ["Logout - User ke 10", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 2.314944919064748, 1.9179968525179854], "isController": false}, {"data": ["[POST] Add Contact - 1", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 2.73895263671875, 2.1870930989583335], "isController": false}, {"data": ["[POST] Add Contact - 3", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 3.881117876838235, 3.102022058823529], "isController": false}, {"data": ["[POST] Add Contact - 2", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 2.926974826388889, 2.3383246527777777], "isController": false}, {"data": ["[POST] Add Contact - 5", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 3.4483862704918034, 2.766393442622951], "isController": false}, {"data": ["[POST] Add Contact - 10", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 3.7095571996466434, 3.002153268551237], "isController": false}, {"data": ["[POST] Add Contact - 4", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.924401719330855, 3.151138475836431], "isController": false}, {"data": ["[POST] Add Contact - 7", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 2.7794471153846154, 2.2484250663129974], "isController": false}, {"data": ["[POST] Add Contact - 6", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 2.0222125956022943, 1.6394299713193117], "isController": false}, {"data": ["[POST] Add Contact - 9", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.8846286900369003, 3.1314863929889296], "isController": false}, {"data": ["[POST] Add Contact - 8", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 2.784242021276596, 2.2518076795212765], "isController": false}, {"data": ["[GET] Contact By ID - 10", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.9578419811320753, 2.0157724056603774], "isController": false}, {"data": ["[PUT] Update Contact - 4", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 2.4633385047281324, 2.177064864066194], "isController": false}, {"data": ["[GET] Contact By ID - 7", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 3.442141089108911, 1.7629692656765676], "isController": false}, {"data": ["[PUT] Update Contact - 3", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 3.606023015202703, 3.1573321368243246], "isController": false}, {"data": ["[GET] Contact By ID - 8", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.9172226123595504, 2.0006729868913857], "isController": false}, {"data": ["[GET] Contact By ID - 5", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 2.808277027027027, 1.443728885135135], "isController": false}, {"data": ["[PUT] Update Contact - 6", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 3.7702287946428568, 3.3238002232142856], "isController": false}, {"data": ["[GET] Contact By ID - 6", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 3.4515881147540983, 1.7514088114754098], "isController": false}, {"data": ["[PUT] Update Contact - 5", 1, 0, 0.0, 1232.0, 1232, 1232, 1232.0, 1232.0, 1232.0, 1232.0, 0.8116883116883118, 0.860833502435065, 0.759372463474026], "isController": false}, {"data": ["[PUT] Update Contact - 8", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 3.821022727272727, 3.3664772727272725], "isController": false}, {"data": ["[PUT] Update Contact - 7", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 3.8359937050359707, 3.3863534172661867], "isController": false}, {"data": ["[GET] Contact By ID - 9", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 3.072878482404692, 1.5665093475073313], "isController": false}, {"data": ["[PUT] Update Contact - 9", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 3.581821518456376, 3.162358431208054], "isController": false}, {"data": ["[GET] Contact By ID - 3", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 3.674060314685315, 1.8677611451048952], "isController": false}, {"data": ["[GET] Contact By ID - 4", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 3.4794081125827816, 1.7688069122516556], "isController": false}, {"data": ["[GET] Contact By ID - 1", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 3.4881897993311037, 1.7865541387959867], "isController": false}, {"data": ["[GET] Contact By ID - 2", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 3.275617163009404, 1.67454447492163], "isController": false}, {"data": ["[GET] Contact List - 9", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.961527122641509, 1.9236438679245282], "isController": false}, {"data": ["[GET] Contact List - 8", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 3.4004733306188926, 1.660474348534202], "isController": false}, {"data": ["[GET] Contact List - 7", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 3.6793023767605635, 1.794949383802817], "isController": false}, {"data": ["[GET] Contact List - 6", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 3.8633241758241756, 1.8672733516483515], "isController": false}, {"data": ["[GET] Contact List - 5", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 3.5077863712374584, 1.704901755852843], "isController": false}, {"data": ["[GET] Contact List - 4", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.8846286900369003, 1.8810539667896677], "isController": false}, {"data": ["[GET] Contact List - 3", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.913510687732342, 1.8950394981412637], "isController": false}, {"data": ["[GET] Contact List - 2", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.9208255597014925, 1.902110541044776], "isController": false}, {"data": ["[GET] Contact List - 1", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 2.971184490084986, 1.4440952549575072], "isController": false}, {"data": ["Get User Profile - 9", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 2.21875, 1.359375], "isController": false}, {"data": ["[PATCH] Update User", 10, 0, 0.0, 481.00000000000006, 271, 1152, 358.5, 1134.9, 1152.0, 1152.0, 1.9600156801254411, 1.6453412877303017, 1.2443419859858877], "isController": true}, {"data": ["Get User Profile - 8", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 2.522053303303303, 1.5308277027027026], "isController": false}, {"data": ["Get User Profile - 7", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 2.9365166083916088, 1.7823972902097904], "isController": false}, {"data": ["Get User Profile - 6", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 2.999441964285714, 1.8205915178571428], "isController": false}, {"data": ["Get User Profile - 5", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 2.7938741721854305, 1.6879656456953642], "isController": false}, {"data": ["[GET] Contact List By ID ", 10, 0, 0.0, 305.7, 265, 370, 302.5, 367.1, 370.0, 370.0, 2.079002079002079, 2.1760492463617465, 1.110560680873181], "isController": true}, {"data": ["Login User - 10", 1, 0, 0.0, 1516.0, 1516, 1516, 1516.0, 1516.0, 1516.0, 1516.0, 0.6596306068601583, 0.808433995712401, 0.17779106200527706], "isController": false}, {"data": ["[GET] User Profile", 10, 0, 0.0, 388.20000000000005, 254, 768, 317.5, 757.3000000000001, 768.0, 768.0, 2.168256721595837, 1.8214203436686904, 1.1053027428447528], "isController": true}, {"data": ["Login User - 9", 1, 0, 0.0, 1306.0, 1306, 1306, 1306.0, 1306.0, 1306.0, 1306.0, 0.7656967840735069, 0.9369317094180704, 0.2056314605666156], "isController": false}, {"data": ["[GET] Contact List - 10", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.9208801498127337, 1.9092345505617976], "isController": false}, {"data": ["Login User - 3", 1, 0, 0.0, 1468.0, 1468, 1468, 1468.0, 1468.0, 1468.0, 1468.0, 0.6811989100817438, 0.8388592047002725, 0.18293916042234332], "isController": false}, {"data": ["Login User - 4", 1, 0, 0.0, 1398.0, 1398, 1398, 1398.0, 1398.0, 1398.0, 1398.0, 0.7153075822603719, 0.8808621691702433, 0.19209920422031473], "isController": false}, {"data": ["Login User - 1", 1, 0, 0.0, 1765.0, 1765, 1765, 1765.0, 1765.0, 1765.0, 1765.0, 0.56657223796034, 0.6977027266288952, 0.15215563031161475], "isController": false}, {"data": ["Get User Profile - 10", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 2.3018973214285716, 1.4004550137362637], "isController": false}, {"data": ["Login User - 2", 1, 0, 0.0, 2477.0, 2477, 2477, 2477.0, 2477.0, 2477.0, 2477.0, 0.4037141703673799, 0.4971519226887364, 0.10841933286233348], "isController": false}, {"data": ["Login User - 7", 1, 0, 0.0, 1451.0, 1451, 1451, 1451.0, 1451.0, 1451.0, 1451.0, 0.6891798759476223, 0.848687327705031, 0.18508248621640247], "isController": false}, {"data": ["Login User - 8", 1, 0, 0.0, 1207.0, 1207, 1207, 1207.0, 1207.0, 1207.0, 1207.0, 0.828500414250207, 1.0202529515327257, 0.2224976698425849], "isController": false}, {"data": ["Login User - 5", 1, 0, 0.0, 1747.0, 1747, 1747, 1747.0, 1747.0, 1747.0, 1747.0, 0.5724098454493417, 0.7071273969662277, 0.15372334716657127], "isController": false}, {"data": ["Login User - 6", 1, 0, 0.0, 1709.0, 1709, 1709, 1709.0, 1709.0, 1709.0, 1709.0, 0.5851375073142189, 0.7228505339379754, 0.157141420421299], "isController": false}, {"data": ["Get User Profile - 4", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 1.0986328125, 0.66375732421875], "isController": false}, {"data": ["Get User Profile - 3", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 3.2426399613899615, 1.9682070463320462], "isController": false}, {"data": ["Get User Profile - 2", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 3.3218503937007875, 2.006951279527559], "isController": false}, {"data": ["Get User Profile - 1", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 1.2705654311649015, 0.7712036686838124], "isController": false}, {"data": ["[POST] Add Contact", 10, 0, 0.0, 342.0, 269, 523, 332.5, 509.1, 523.0, 523.0, 2.075119319360863, 2.1837388462336587, 1.7569613768416683], "isController": true}, {"data": ["[PUT] Update Contact - 2", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 3.5182119205298013, 3.091370033112583], "isController": false}, {"data": ["[PUT] Update Contact - 1", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 3.1457411504424777, 2.765486725663717], "isController": false}, {"data": ["Update User - 9", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 2.9024662456445993, 2.211726916376307], "isController": false}, {"data": ["Update User - 1", 1, 0, 0.0, 981.0, 981, 981, 981.0, 981.0, 981.0, 981.0, 1.0193679918450562, 0.8571053134556575, 0.647059760448522], "isController": false}, {"data": ["Update User - 2", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 2.863479872881356, 2.1517478813559325], "isController": false}, {"data": ["Update User - 3", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.1026579797047966, 2.342308579335793], "isController": false}, {"data": ["Update User - 4", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 2.127774716624685, 1.5989058564231737], "isController": false}, {"data": ["Update User - 5", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 2.10205078125, 1.5869140625], "isController": false}, {"data": ["Update User - 6", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 2.001953125, 1.5113467261904763], "isController": false}, {"data": ["Update User - 7", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 2.6275634765625, 1.983642578125], "isController": false}, {"data": ["Update User - 8", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 2.9024662456445993, 2.211726916376307], "isController": false}, {"data": ["[GET] Contact List", 10, 0, 0.0, 285.6, 265, 353, 272.0, 348.40000000000003, 353.0, 353.0, 2.077274615704196, 2.1799211933942666, 1.0589231927710843], "isController": true}, {"data": ["Delete Contact - 10", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 2.714269301470588, 2.2295783547794117], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

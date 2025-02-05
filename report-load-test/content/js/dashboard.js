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

    var data = {"OkPercent": 74.44444444444444, "KoPercent": 25.555555555555557};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Delete Contact - 5"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 4"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 7"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 6"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 1"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 10"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 2"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 9"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 4"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 9"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 5"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Contact - 8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 2"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 3"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 1"], "isController": false}, {"data": [0.0, 500, 1500, "[DELETE] Delete Contact"], "isController": true}, {"data": [0.95, 500, 1500, "[PUT] Update Contact"], "isController": true}, {"data": [1.0, 500, 1500, "Update User - 10"], "isController": false}, {"data": [0.0, 500, 1500, "Logout - User ke 10"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 1"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 10"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 7"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 10"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 7"], "isController": false}, {"data": [0.5, 500, 1500, "[PUT] Update Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 6"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 7"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 1"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact By ID - 2"], "isController": false}, {"data": [0.5, 500, 1500, "[GET] Contact List - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 8"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 7"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 6"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 4"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 3"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 9"], "isController": false}, {"data": [0.9, 500, 1500, "[PATCH] Update User"], "isController": true}, {"data": [1.0, 500, 1500, "Get User Profile - 8"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 7"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 6"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 5"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List By ID "], "isController": true}, {"data": [0.0, 500, 1500, "Login User - 10"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] User Profile"], "isController": true}, {"data": [0.0, 500, 1500, "Login User - 9"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] Contact List - 10"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 3"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 4"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 10"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 2"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 7"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 8"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 5"], "isController": false}, {"data": [0.0, 500, 1500, "Login User - 6"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 4"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 2"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Profile - 1"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] Add Contact"], "isController": true}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] Update Contact - 1"], "isController": false}, {"data": [0.5, 500, 1500, "Update User - 9"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 1"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 2"], "isController": false}, {"data": [0.5, 500, 1500, "Update User - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 4"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 5"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 6"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 7"], "isController": false}, {"data": [1.0, 500, 1500, "Update User - 8"], "isController": false}, {"data": [0.95, 500, 1500, "[GET] Contact List"], "isController": true}, {"data": [0.0, 500, 1500, "Delete Contact - 10"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 23, 25.555555555555557, 3897.1222222222223, 0, 30249, 274.0, 30237.0, 30239.0, 30249.0, 2.2259045828902133, 2.646304921104049, 1.1794685807385057], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Contact - 5", 1, 1, 100.0, 30240.0, 30240, 30240, 30240.0, 30240.0, 30240.0, 30240.0, 0.033068783068783074, 0.03952752976190477, 0.017600084738756613], "isController": false}, {"data": ["Delete Contact - 4", 1, 1, 100.0, 30239.0, 30239, 30239, 30239.0, 30239.0, 30239.0, 30239.0, 0.0330698766493601, 0.03952883693243824, 0.01760066677138794], "isController": false}, {"data": ["Delete Contact - 7", 1, 1, 100.0, 30239.0, 30239, 30239, 30239.0, 30239.0, 30239.0, 30239.0, 0.0330698766493601, 0.039270478521115114, 0.01760066677138794], "isController": false}, {"data": ["Delete Contact - 6", 1, 1, 100.0, 30239.0, 30239, 30239, 30239.0, 30239.0, 30239.0, 30239.0, 0.0330698766493601, 0.03939965772677668, 0.01760066677138794], "isController": false}, {"data": ["Delete Contact - 1", 1, 1, 100.0, 30237.0, 30237, 30237, 30237.0, 30237.0, 30237.0, 30237.0, 0.03307206402751596, 0.039402263782782686, 0.017601830952144723], "isController": false}, {"data": ["Delete Contact - 3", 1, 1, 100.0, 30239.0, 30239, 30239, 30239.0, 30239.0, 30239.0, 30239.0, 0.0330698766493601, 0.03952883693243824, 0.01760066677138794], "isController": false}, {"data": ["[PUT] Update Contact - 10", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 3.7261746453900715, 3.2829122340425534], "isController": false}, {"data": ["Delete Contact - 2", 1, 1, 100.0, 30238.0, 30238, 30238, 30238.0, 30238.0, 30238.0, 30238.0, 0.03307097030226867, 0.039400960711687284, 0.01760124884251604], "isController": false}, {"data": ["Logout - User ke 8", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["Logout - User ke 9", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["Logout - User ke 6", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Logout - User ke 7", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["Logout - User ke 4", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["Delete Contact - 9", 1, 1, 100.0, 30245.0, 30245, 30245, 30245.0, 30245.0, 30245.0, 30245.0, 0.03306331625061994, 0.039391841626715156, 0.017597175152917838], "isController": false}, {"data": ["Logout - User ke 5", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["Delete Contact - 8", 1, 1, 100.0, 30237.0, 30237, 30237, 30237.0, 30237.0, 30237.0, 30237.0, 0.03307206402751596, 0.039402263782782686, 0.017601830952144723], "isController": false}, {"data": ["Logout - User ke 2", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["Logout - User ke 3", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Logout - User ke 1", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["[DELETE] Delete Contact", 10, 10, 100.0, 30240.199999999997, 30237, 30249, 30239.0, 30248.6, 30249.0, 30249.0, 0.27599911680282624, 0.3290426970633694, 0.1468940611890042], "isController": true}, {"data": ["[PUT] Update Contact", 10, 0, 0.0, 367.90000000000003, 277, 1149, 281.5, 1062.9000000000003, 1149.0, 1149.0, 1.5971889474524836, 1.6895264334770803, 1.4898778150455199], "isController": true}, {"data": ["Update User - 10", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.118465381040892, 2.3633538568773234], "isController": false}, {"data": ["Logout - User ke 10", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2074.21875, 0.0], "isController": false}, {"data": ["[POST] Add Contact - 1", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 3.716458701413428, 2.9814487632508837], "isController": false}, {"data": ["[POST] Add Contact - 3", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 3.817147582116788, 3.0722513686131383], "isController": false}, {"data": ["[POST] Add Contact - 2", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 3.7965636322463765, 3.042912137681159], "isController": false}, {"data": ["[POST] Add Contact - 5", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 3.810019388686131, 3.0793795620437954], "isController": false}, {"data": ["[POST] Add Contact - 10", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 3.873937270220588, 3.1235638786764706], "isController": false}, {"data": ["[POST] Add Contact - 4", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 3.6638166520979025, 2.963833041958042], "isController": false}, {"data": ["[POST] Add Contact - 7", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.877421586715867, 3.1242792896678964], "isController": false}, {"data": ["[POST] Add Contact - 6", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 3.846316561371841, 3.0953858303249095], "isController": false}, {"data": ["[POST] Add Contact - 9", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 2.4312572170900695, 1.959891021939954], "isController": false}, {"data": ["[POST] Add Contact - 8", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 3.852788549270073, 3.093635948905109], "isController": false}, {"data": ["[GET] Contact By ID - 10", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.9281952247191008, 2.0006729868913857], "isController": false}, {"data": ["[PUT] Update Contact - 4", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 3.7214006696428568, 3.2889229910714284], "isController": false}, {"data": ["[GET] Contact By ID - 7", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.9172638627819545, 2.008194313909774], "isController": false}, {"data": ["[PUT] Update Contact - 3", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 0.9247171453437771, 0.8125271975630983], "isController": false}, {"data": ["[GET] Contact By ID - 8", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 3.8488051470588234, 1.9638959099264703], "isController": false}, {"data": ["[GET] Contact By ID - 5", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 3.8347069597069594, 1.956702152014652], "isController": false}, {"data": ["[PUT] Update Contact - 6", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 3.7568116103202844, 3.311971752669039], "isController": false}, {"data": ["[PUT] Update Contact - 5", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 3.8152441756272397, 3.3532146057347667], "isController": false}, {"data": ["[GET] Contact By ID - 6", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.928032063197026, 1.985798094795539], "isController": false}, {"data": ["[PUT] Update Contact - 8", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 3.8498420577617325, 3.3985785198555956], "isController": false}, {"data": ["[PUT] Update Contact - 7", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 3.699204946996467, 3.2713118374558308], "isController": false}, {"data": ["[GET] Contact By ID - 9", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 3.675863776408451, 1.880914392605634], "isController": false}, {"data": ["[PUT] Update Contact - 9", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 3.706190321180556, 3.272162543402778], "isController": false}, {"data": ["[GET] Contact By ID - 3", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.884304775280899, 2.0006729868913857], "isController": false}, {"data": ["[GET] Contact By ID - 4", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.90625, 2.0006729868913857], "isController": false}, {"data": ["[GET] Contact By ID - 1", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.9062499999999996, 1.9932077891791045], "isController": false}, {"data": ["[GET] Contact By ID - 2", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.8483796296296293, 1.978443287037037], "isController": false}, {"data": ["[GET] Contact List - 9", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 1.8325136952191234, 0.6769795816733067], "isController": false}, {"data": ["[GET] Contact List - 8", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 4.848304991166078, 1.8012919611307423], "isController": false}, {"data": ["[GET] Contact List - 7", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 4.986171304744525, 1.8604584854014596], "isController": false}, {"data": ["[GET] Contact List - 6", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 5.0859660127737225, 1.8604584854014596], "isController": false}, {"data": ["[GET] Contact List - 5", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 5.033605238970588, 1.8741383272058822], "isController": false}, {"data": ["[GET] Contact List - 4", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 5.012540359778598, 1.8810539667896677], "isController": false}, {"data": ["[GET] Contact List - 3", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 4.173394756838905, 1.5494395896656534], "isController": false}, {"data": ["[GET] Contact List - 2", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 5.00801282051282, 1.8672733516483515], "isController": false}, {"data": ["[GET] Contact List - 1", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 5.040207188644688, 1.8672733516483515], "isController": false}, {"data": ["Get User Profile - 9", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 3.221533764367816, 1.953125], "isController": false}, {"data": ["[PATCH] Update User", 10, 0, 0.0, 424.79999999999995, 266, 1132, 271.5, 1113.9, 1132.0, 1132.0, 1.5969338869370808, 1.338679734908975, 1.0138346874001918], "isController": true}, {"data": ["Get User Profile - 8", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 3.27167436770428, 1.9835238326848248], "isController": false}, {"data": ["Get User Profile - 7", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 3.2438529554263567, 1.9758357558139534], "isController": false}, {"data": ["Get User Profile - 6", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 3.310316190944882, 2.006951279527559], "isController": false}, {"data": ["Get User Profile - 5", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 3.256474951361868, 1.9835238326848248], "isController": false}, {"data": ["[GET] Contact List By ID ", 10, 0, 0.0, 270.3, 266, 284, 268.5, 282.9, 284.0, 284.0, 1.6007683688170322, 1.6729905354570194, 0.855097947014567], "isController": true}, {"data": ["Login User - 10", 1, 1, 100.0, 4065.0, 4065, 4065, 4065.0, 4065.0, 4065.0, 4065.0, 0.24600246002460022, 0.3017373923739237, 0.06630535055350553], "isController": false}, {"data": ["[GET] User Profile", 10, 0, 0.0, 258.3, 254, 271, 257.0, 270.0, 271.0, 271.0, 1.599488163787588, 1.3414457373640436, 0.8153640834932822], "isController": true}, {"data": ["Login User - 9", 1, 0, 0.0, 2256.0, 2256, 2256, 2256.0, 2256.0, 2256.0, 2256.0, 0.4432624113475177, 0.5462862921099292, 0.11904019835992909], "isController": false}, {"data": ["[GET] Contact List - 10", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 5.033605238970588, 1.8741383272058822], "isController": false}, {"data": ["Login User - 3", 1, 0, 0.0, 1813.0, 1813, 1813, 1813.0, 1813.0, 1813.0, 1813.0, 0.5515719801434088, 0.6776147959183674, 0.14812724076116934], "isController": false}, {"data": ["Login User - 4", 1, 0, 0.0, 2830.0, 2830, 2830, 2830.0, 2830.0, 2830.0, 2830.0, 0.3533568904593639, 0.434104461130742, 0.09489564929328621], "isController": false}, {"data": ["Login User - 1", 1, 0, 0.0, 2565.0, 2565, 2565, 2565.0, 2565.0, 2565.0, 2565.0, 0.3898635477582846, 0.47895346003898637, 0.10469968323586745], "isController": false}, {"data": ["Get User Profile - 10", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 3.261566162109375, 1.99127197265625], "isController": false}, {"data": ["Login User - 2", 1, 0, 0.0, 2599.0, 2599, 2599, 2599.0, 2599.0, 2599.0, 2599.0, 0.38476337052712584, 0.4741907945363601, 0.10333000673335897], "isController": false}, {"data": ["Login User - 7", 1, 1, 100.0, 3798.0, 3798, 3798, 3798.0, 3798.0, 3798.0, 3798.0, 0.2632964718272775, 0.324492331490258, 0.07070950171142706], "isController": false}, {"data": ["Login User - 8", 1, 0, 0.0, 2638.0, 2638, 2638, 2638.0, 2638.0, 2638.0, 2638.0, 0.37907505686125853, 0.4671803923426839, 0.10180238343442002], "isController": false}, {"data": ["Login User - 5", 1, 0, 0.0, 2778.0, 2778, 2778, 2778.0, 2778.0, 2778.0, 2778.0, 0.3599712023038157, 0.4422302465802736, 0.09667195374370051], "isController": false}, {"data": ["Login User - 6", 1, 1, 100.0, 3582.0, 3582, 3582, 3582.0, 3582.0, 3582.0, 3582.0, 0.27917364600781686, 0.34187866415410384, 0.07497339126186488], "isController": false}, {"data": ["Get User Profile - 4", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 3.2820159313725488, 1.9990808823529411], "isController": false}, {"data": ["Get User Profile - 3", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 3.284454345703125, 1.99127197265625], "isController": false}, {"data": ["Get User Profile - 2", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.1026579797047966, 1.8810539667896677], "isController": false}, {"data": ["Get User Profile - 1", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 3.2438529554263567, 1.9758357558139534], "isController": false}, {"data": ["[POST] Add Contact", 10, 0, 0.0, 292.0, 271, 433, 275.0, 418.30000000000007, 433.0, 433.0, 1.5964240102171137, 1.6787396232439336, 1.3516597820881227], "isController": true}, {"data": ["[PUT] Update Contact - 2", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 3.767730496453901, 3.3244680851063833], "isController": false}, {"data": ["[PUT] Update Contact - 1", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 3.811404001798561, 3.361763714028777], "isController": false}, {"data": ["Update User - 9", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.8800358175604627, 0.6674717402733965], "isController": false}, {"data": ["Update User - 1", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.1141493055555554, 2.3509837962962963], "isController": false}, {"data": ["Update User - 2", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.1609786184210527, 2.3863369360902253], "isController": false}, {"data": ["Update User - 3", 1, 0, 0.0, 1132.0, 1132, 1132, 1132.0, 1132.0, 1132.0, 1132.0, 0.8833922261484098, 0.7393233767667845, 0.5607470185512368], "isController": false}, {"data": ["Update User - 4", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.122813666044776, 2.368528451492537], "isController": false}, {"data": ["Update User - 5", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 3.0181442481884058, 2.2998754528985503], "isController": false}, {"data": ["Update User - 6", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.1141493055555554, 2.3509837962962963], "isController": false}, {"data": ["Update User - 7", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 3.0656192765567765, 2.3251488095238093], "isController": false}, {"data": ["Update User - 8", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 3.0799278846153846, 2.3251488095238093], "isController": false}, {"data": ["[GET] Contact List", 10, 0, 0.0, 327.4, 271, 753, 273.5, 710.6000000000001, 753.0, 753.0, 1.5992323684631378, 2.1948839557012634, 0.8152336878298416], "isController": true}, {"data": ["Delete Contact - 10", 1, 1, 100.0, 30249.0, 30249, 30249, 30249.0, 30249.0, 30249.0, 30249.0, 0.03305894409732553, 0.03938663261595425, 0.017594848176799235], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 3,798 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 4.3478260869565215, 1.1111111111111112], "isController": false}, {"data": ["503/Service Unavailable", 10, 43.47826086956522, 11.11111111111111], "isController": false}, {"data": ["The operation lasted too long: It took 3,582 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 4.3478260869565215, 1.1111111111111112], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 10, 43.47826086956522, 11.11111111111111], "isController": false}, {"data": ["The operation lasted too long: It took 4,065 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 4.3478260869565215, 1.1111111111111112], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 23, "503/Service Unavailable", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 10, "The operation lasted too long: It took 3,798 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,582 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,065 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete Contact - 5", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Contact - 4", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Contact - 7", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Contact - 6", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Contact - 1", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Contact - 3", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Contact - 2", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 8", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 9", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 6", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 7", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 4", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Contact - 9", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 5", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Contact - 8", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 2", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 3", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout - User ke 1", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout - User ke 10", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: thinking-tester-contact-list.herokuapp.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login User - 10", 1, 1, "The operation lasted too long: It took 4,065 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login User - 7", 1, 1, "The operation lasted too long: It took 3,798 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login User - 6", 1, 1, "The operation lasted too long: It took 3,582 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Contact - 10", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

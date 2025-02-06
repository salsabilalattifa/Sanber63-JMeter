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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "[POST] Add User - 9"], "isController": false}, {"data": [0.5, 500, 1500, "[POST] Add User - 7"], "isController": false}, {"data": [0.5, 500, 1500, "[POST] Add User - 8"], "isController": false}, {"data": [0.0, 500, 1500, "[POST] Add User - 5"], "isController": false}, {"data": [0.5, 500, 1500, "[POST] Add User - 6"], "isController": false}, {"data": [0.0, 500, 1500, "[POST] Add User - 3"], "isController": false}, {"data": [0.5, 500, 1500, "[POST] Add User - 10"], "isController": false}, {"data": [0.5, 500, 1500, "[POST] Add User - 4"], "isController": false}, {"data": [0.5, 500, 1500, "[POST] Add User - 1"], "isController": false}, {"data": [0.0, 500, 1500, "[POST] Add User - 2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10, 0, 0.0, 1410.5, 1042, 1739, 1408.5, 1738.6, 1739.0, 1739.0, 1.725327812284334, 2.1293645402001378, 0.5479263716356108], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[POST] Add User - 9", 1, 0, 0.0, 1350.0, 1350, 1350, 1350.0, 1350.0, 1350.0, 1350.0, 0.7407407407407407, 0.9143518518518517, 0.23509837962962962], "isController": false}, {"data": ["[POST] Add User - 7", 1, 0, 0.0, 1210.0, 1210, 1210, 1210.0, 1210.0, 1210.0, 1210.0, 0.8264462809917356, 1.0169163223140496, 0.2622998450413223], "isController": false}, {"data": ["[POST] Add User - 8", 1, 0, 0.0, 1112.0, 1112, 1112, 1112.0, 1112.0, 1112.0, 1112.0, 0.8992805755395684, 1.1100494604316546, 0.2854161982913669], "isController": false}, {"data": ["[POST] Add User - 5", 1, 0, 0.0, 1650.0, 1650, 1650, 1650.0, 1650.0, 1650.0, 1650.0, 0.6060606060606061, 0.7457386363636364, 0.1923532196969697], "isController": false}, {"data": ["[POST] Add User - 6", 1, 0, 0.0, 1042.0, 1042, 1042, 1042.0, 1042.0, 1042.0, 1042.0, 0.9596928982725528, 1.1808721209213051, 0.3045900311900192], "isController": false}, {"data": ["[POST] Add User - 3", 1, 0, 0.0, 1739.0, 1739, 1739, 1739.0, 1739.0, 1739.0, 1739.0, 0.5750431282346176, 0.7120651236342725, 0.1825088053479011], "isController": false}, {"data": ["[POST] Add User - 10", 1, 0, 0.0, 1301.0, 1301, 1301, 1301.0, 1301.0, 1301.0, 1301.0, 0.7686395080707148, 0.9562956379707918, 0.24545421790930055], "isController": false}, {"data": ["[POST] Add User - 4", 1, 0, 0.0, 1499.0, 1499, 1499, 1499.0, 1499.0, 1499.0, 1499.0, 0.66711140760507, 0.820859739826551, 0.211729694796531], "isController": false}, {"data": ["[POST] Add User - 1", 1, 0, 0.0, 1467.0, 1467, 1467, 1467.0, 1467.0, 1467.0, 1467.0, 0.6816632583503749, 0.8387653374233128, 0.21634820211315609], "isController": false}, {"data": ["[POST] Add User - 2", 1, 0, 0.0, 1735.0, 1735, 1735, 1735.0, 1735.0, 1735.0, 1735.0, 0.5763688760806917, 0.7137067723342939, 0.1829295749279539], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

// Select the dropdown element and get the raw HTML node
var dropDown = d3.select("#selDataset");
// Select the metadata div element and get the raw HTML node
var metaData = d3.select("#sample-metadata");

 
function createChatrts(sample) {
    console.log(sample)
    var queryData = "samples.json";
    d3.json(queryData).then((data)=> {
    var newChart = data.samples.filter(s => s.id == sample)
    console.log(newChart)
    
    newChart = newChart[0];

    var otuids = newChart.otu_ids;
    var otulabels = newChart.otu_labels;
    var samplevals = newChart.sample_values;

    var trace1 = {
        x: samplevals.slice(0, 10).reverse(),
        y: otuids.slice(0, 10).map(id => "OTU " + id).reverse(),
        text: otulabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };
      
      var chartData = [trace1];      
      var layout = {
        title: "Top 10 Bactaria Cultures"
      };      
      Plotly.newPlot("bar", chartData, layout);


      var trace2 = {
        x: otuids,
        y: samplevals,
        text: otulabels,
        mode: "markers",
        marker: {
            size: samplevals,
            color: otuids,
            colorscale: "Earth"            
        }        
      };      
      var chartData = [trace2];      
      var layout = {
        title: "Bactaria Cultures per sample"
      };      
      Plotly.newPlot("bubble", chartData, layout);

      var meta = data.metadata.filter(s => s.id == sample)
      meta = meta[0];
      // Clear previous entries in the metadata panel
      metaData.html("")

      Object.entries(meta).forEach(([key, value]) => {
          metaData.append("h6").text(key.toUpperCase() + ": " + value);
      })
      var guageChart = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: meta.wfreq,
            title: "Scrubs Per Week",
            type: "indicator",
            mode: "gauge+number"
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', guageChart, layout);
    })

}
function init() {
    // Store the json data in a variable
    var queryData = "samples.json";
    d3.json(queryData).then((data)=> {
            console.log(data);
        // create the drop down menu of cities
        data.names.forEach((id)=>{
           dropDown.append("option").text(id).property("value", id) 
        })
        createChatrts(data.names[0])           
    });

}
function optionChanged(selected){
    createChatrts(selected)
    
}
init();





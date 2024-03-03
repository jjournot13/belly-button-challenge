// Assign variable to source URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create initial function to populate the dropdown, bar chart, and bubble chart with the datasets
function init(){
    
    // Initialize variable for dropdown list
    let dropdown = d3.select("#selDataset");
    
    // Access data using d3
    d3.json(url).then((data) => {
    
    // Populate the dropdown with all sample ids
    let sampleIds = data.names;
        for (id of sampleIds){
            dropdown.append("option").text(id).property("value", id);
        };
    
    // Use first sample to create initial visualizations
    barChart(sampleIds[0]);
    bubbleChart(sampleIds[0]);
    demographics(sampleIds[0]);
    });
};

// Create a function to populate bar charts
function barChart(sample){

    // Access the data to populate bar charts
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        
        // Filter to match based on sample id
        let allSamples = sampleData.filter(item => item.id == sample);
        
        // Store the first entry
        let firstSample = allSamples[0];
                
        // Find the top 10 results to display in bar charts
        let sampleValues = firstSample.sample_values.slice(0,10);
        let otuIds = firstSample.otu_ids.slice(0,10);
        let otuLabels = firstSample.otu_labels.slice(0,10);

        // Create trace for bar charts
        let barTrace = {
            x: sampleValues.reverse(),
            y: otuIds.map(item => `OTU ${item}`).reverse(),
            text: otuLabels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = {title: "Top Ten OTUs Found"};
        Plotly.newPlot("bar", [barTrace], layout);
    });
};

function bubbleChart(sample){
    
    // Access the data to populate bubble charts
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        
        // Filter to match based on sample id
        let allSamples = sampleData.filter(item => item.id == sample);
        
        // Store the first entry
        let firstSample = allSamples[0];
        
        // Find the results to display in bubble charts
        let sampleValues = firstSample.sample_values;
        let otuIds = firstSample.otu_ids;
        let otuLabels = firstSample.otu_labels;

        // Create trace for bubble charts
        let bubbleTrace = {
            x: otuIds.reverse(),
            y: sampleValues.reverse(),
            text: otuLabels.reverse(),
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
            }
        };

        let layout = {
            title: "Bacteria Frequency Per Sample",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubbleTrace], layout);
    });
};

// Create function to populate each samples' demographics information
function demographics(sample){
    
    // Access data to populate demographics section
    d3.json(url).then((data) => {
    
    // Access demographic information with d3
    let demographics = data.metadata;
    
    // Filter to match based on sample id
    let allDemographics = demographics.filter(item => item.id == sample);
    
    // Store the first entry
    let firstDemographic = allDemographics[0];
    
    // Clear previous entry in demographic information section using blank string
    d3.select('#sample-metadata').text('');

    Object.entries(firstDemographic).forEach(([key,value]) => {
        
    // Select html for demographic information and append new key value pairs
    d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
    });
    
    });
};

// Create function to detect when the dropdown changes
function optionChanged(value){

    barChart(value);
    bubbleChart(value);
    demographics(value);
};

init();
// Build the metadata panel
  function buildMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
      // Get the metadata field
      let metadata = data.metadata;
  
      // Filter the metadata for the object with the desired sample number
      let filteredMetaData = metadata.find(obj => obj.id === sample);
      if (filteredMetaData) {
        // Use d3 to select the panel with id of `#sample-metadata`
        let panelMetaData = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        panelMetaData.html("");
  
        // Inside a loop, you will need to use d3 to append new
        // tags for each key-value in the filtered metadata.
        Object.entries(filteredMetaData).forEach(([key, value]) => {
          panelMetaData.append("p").text(`${key}: ${value}`);
        });
      } else {
        console.log("Metadata not found for sample:", sample);
      }
    });
  }

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleObjects = samples.filter(obj => obj.id === sample)[0]

    // Get the otu_ids, otu_labels, and sample_values
    let otuIDs = sampleObjects.otu_ids;
    let otuLabels = sampleObjects.otu_labels;
    let sampleValues = sampleObjects.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: 'Earth' // dunno what this means or does
      }
    }];

    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      }
    };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria'
      }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropDown.append("option").text(sample);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();

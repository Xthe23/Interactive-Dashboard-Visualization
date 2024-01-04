let globalData = null; // Global variable to store the data
/*
Function to fetch data and store it in a global variable. Called at page load.

NOTE: Best standard practice is to avoid global variables, but they are useful in this case because we need to access the data in multiple functions. 
      Aditionally, the data is not changing in this application, so we don't need to worry about updating the global variable.

*/
function fetchData() {
  d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  ).then((data) => {
    globalData = data;
    populateDropdown(data.names);
    optionChanged(data.names[0]);
  });
}

// Responsible for displaying metadata on a web page.
function iterateMetadata(metadata) {
  // Get a reference to the HTML element where you want to display the data
  let container = document.getElementById("sample-metadata");

  // Clear out previous data
  container.innerHTML = "";

  for (let key in metadata) {
    // Create a new paragraph element for each key-value pair
    let paragraph = document.createElement("p");

    // Set the text of the paragraph to the key and value
    paragraph.textContent = key + ": " + metadata[key];

    // Append the paragraph to the container
    container.appendChild(paragraph);
  }
}

// Populates the dropdown with all of the test subjects.
function populateDropdown(names) {
  // Get a reference to the select element
  let select = document.getElementById("selDataset");

  // Loop through the test subjects
  for (let i = 0; i < names.length; i++) {
    // Create a new option element
    let option = document.createElement("option");

    // Set the value and text of the option to the test subject ID
    option.value = names[i];
    option.text = names[i];

    // Append the option to the select
    select.appendChild(option);
  }
}

// Finds and returns metadata for a given ID.
function findMetadataById(id, metadataArray) {
  return metadataArray.find((metadata) => metadata.id === id) || null;
}

// Finds and returns sample data for a given ID.
function findSampleById(id, samplesArray) {
  // Convert the id to a string as sample ids are strings in the provided data structure
  let idString = id.toString();
  return samplesArray.find((sample) => sample.id === idString) || null;
}

// Called when a new option is selected in the dropdown.
function optionChanged(selectedOption) {
  if (!globalData) {
    console.log("Data not loaded yet");
    return;
  }

  // Convert the selectedOption to a number
  let selectedOptionNumber = Number(selectedOption);

  // Find the metadata for the selected option
  let selectedMetadata = findMetadataById(
    selectedOptionNumber,
    globalData.metadata
  );

  if (selectedMetadata) {
    // Display the metadata on the web page
    iterateMetadata(selectedMetadata);

    // Find the sample data for the selected option
    let selectedSample = findSampleById(
      selectedOptionNumber,
      globalData.samples
    );

    if (selectedSample) {
      console.log("Sample data:", selectedSample);
    } else {
      console.log("Sample data not found for ID:", selectedOptionNumber);
    }
  } else {
    console.log("Metadata not found for ID:", selectedOptionNumber);
  }
}

// A) TODO: Create a horizontal bar chart which displays the top 10 OTUs found in that individual.
// A.1) Use sample_values as the values for the bar chart.
// A.2) Use otu_ids as the labels for the bar chart.
// A.3) Use otu_labels as the hovertext for the chart.

// B) TODO: Create a bubble chart that displays each sample.
// B.1) Use otu_ids for the x values.
// B.2) Use sample_values for the y values.
// B.3) Use sample_values for the marker size.
// B.4) Use otu_ids for the marker colors.
// B.5) Use otu_labels for the text values.

// C) TODO: Both the bubble chart and the bar chart should update each time a new sample is selected.

// D) BONUS* TODO: Create a gauge chart to plot the weekly washing frequency of the individual.
// *Note: Use this as a reference for the gauge chart: https://plot.ly/javascript/gauge-charts/

// E) Deploy your app to a free static page hosting service, such as GitHub Pages.

// Call fetchData on page load.
fetchData();

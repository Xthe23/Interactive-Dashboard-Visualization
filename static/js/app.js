let globalData = null; // Global variable to store the data

// Global variables to store the current displayed sample and metadata
let currentSample = null;
let currentMetadata = null;

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

  // Store the current sample and metadata
  currentMetadata = findMetadataById(selectedOptionNumber, globalData.metadata);
  currentSample = findSampleById(selectedOptionNumber, globalData.samples);

  if (currentMetadata) {
    // Display the metadata on the web page
    iterateMetadata(currentMetadata);

    if (currentSample) {
      // console.log("Sample data:", selectedSample);

      // Call createBarChart function
      createBarChart(currentSample);
      // Call createBubbleChart function
      createBubbleChart(currentSample);
      // Call createWeeklyWashingFrequencyGaugeChart function
      createWeeklyWashingFrequencyGaugeChart(currentMetadata);
    } else {
      console.log("Sample data not found for ID:", selectedOptionNumber);
    }
  } else {
    console.log("Metadata not found for ID:", selectedOptionNumber);
  }
  // Redraw charts with the new data
  redrawCharts(); // Call the redrawCharts function instead of redrawing here
}

// Function to redraw all charts based on the current sample and metadata
function redrawCharts() {
  // Make sure to clear or overwrite existing charts before redrawing
  if (currentSample && currentMetadata) {
    createBarChart(currentSample);
    createBubbleChart(currentSample);
    createWeeklyWashingFrequencyGaugeChart(currentMetadata);
  }
}

// Event listener for window resize
window.addEventListener("resize", redrawCharts);

// Helper function to format the labels
function formatLabel(label) {
  // Split the label by semicolon
  const [domain, phylum, classVal, order, family, genus] = label.split(";");
  // Replace undefined values with "Unknown"
  const formattedLabel = [
    domain || "Unknown",
    phylum || "Unknown",
    classVal || "Unknown",
    order || "Unknown",
    family || "Unknown",
    genus || "Unknown",
  ];
  // Return the label in the desired format
  return `Domain: ${formattedLabel[0]}<br>Phylum: ${formattedLabel[1]}<br>Class: ${formattedLabel[2]}<br>Order: ${formattedLabel[3]}<br>Family: ${formattedLabel[4]}<br>Genus: ${formattedLabel[5]}`;
}
// Creates a bar chart that displays the top 10 OTUs found in that individual.
function createBarChart(sample) {
  // Sort the sample values in descending order
  let sortedValues = sample.sample_values.slice(0, 10).reverse();

  // Sort the OTU IDs accordingly
  let sortedIds = sample.otu_ids.slice(0, 10).reverse();

  // Sort the OTU labels accordingly
  let sortedLabels = sample.otu_labels.slice(0, 10).reverse();

  // Create the trace for the bar chart
  let trace = {
    x: sortedValues,
    y: sortedIds.map((id) => `OTU ${id}`),
    text: sortedLabels.map(formatLabel),
    type: "bar",
    orientation: "h",
  };

  // Create the data array
  let data = [trace];

  // Create the layout for the bar chart
  let layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" },
  };

  // Plot the bar chart
  Plotly.newPlot("bar", data, layout);
}

// Creates a bubble chart that displays each sample of OTUs.
function createBubbleChart(sample) {
  // Create the trace for the bubble chart
  let trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels.map(formatLabel),
    mode: "markers",
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids,
      colorscale: "Earth",
    },
  };

  // Create the data array
  let data = [trace];

  // Adjust the layout for the bubble chart to fit in the card container
  let layout = {
    title: "Sample Distribution",
    xaxis: { title: "OTU IDs" },
    yaxis: { title: "Sample Values" },
    showlegend: false,
    height: 600, // Adjusted height
    width: document.getElementById("bubble").clientWidth, // Responsive width
    margin: { t: 50, r: 25, l: 25, b: 25 }, // Adjusted margins
  };

  // Plot the bubble chart
  Plotly.newPlot("bubble", data, layout);
}

function createWeeklyWashingFrequencyGaugeChart(sample) {
  // Increase the size of the needle
  const needleSize = 35; // Increase this value to make the needle larger

  // Calculate angle for each segment in the gauge
  const colors = [
    "#f7fcf5",
    "#e5f5e0",
    "#c7e9c0",
    "#a1d99b",
    "#74c476",
    "#41ab5d",
    "#238b45",
    "#006d2c",
    "#00441b",
  ];

  // Create the gauge part
  const gaugeData = {
    type: "pie",
    showlegend: false,
    hole: 0.5,
    rotation: 90,
    values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 450],
    text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
    direction: "clockwise",
    textinfo: "text",
    textposition: "inside",
    marker: {
      colors: [...colors, "rgba(255, 255, 255, 0)"], // Last color is for the center
      labels: [
        "0-1",
        "1-2",
        "2-3",
        "3-4",
        "4-5",
        "5-6",
        "6-7",
        "7-8",
        "8-9",
        "",
      ],
      hoverinfo: "label",
    },
    hoverinfo: "skip",
  };

  // Create the needle based on the gauge value
  // The angle should be subtracted from 180 to flip the direction
  const degrees = 180 - sample.wfreq * 20;
  const radius = 0.5;
  const radians = (degrees * Math.PI) / 180;
  const x = radius * Math.cos(radians); // Flip the direction of the needle
  const y = radius * Math.sin(radians);

  // Path for the needle shape
  const mainPath = "M .0 -0.025 L .0 0.025 L ",
    pathX = String(x),
    space = " ",
    pathY = String(y),
    pathEnd = " Z";
  const path = mainPath.concat(pathX, space, pathY, pathEnd);
  const needle = {
    type: "scatter",
    x: [0],
    y: [0],
    marker: { size: needleSize, color: "850000" },
    showlegend: false,
    name: "frequency",
    text: sample.wfreq,
    hoverinfo: "text+name",
    mode: "markers+text",
    textposition: "bottom center",
  };

  // Define the layout for the gauge chart
  const layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000",
        },
      },
    ],
    title: {
      text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      y: 0.85,
      x: 0.5,
    },
    height: 400,
    width: document.getElementById("gauge").clientWidth, // Responsive width
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1],
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1],
    },
    autosize: false,
    margin: { t: 100, r: 25, l: 25, b: 25 }, // Adjusted margins
  };

  // Combine gauge data and needle data for the Plotly plot
  const data = [gaugeData, needle];

  // Render the gauge chart
  Plotly.newPlot("gauge", data, layout);
}

// E) Deploy your app to a free static page hosting service, such as GitHub Pages.

// Call fetchData on page load.
fetchData();

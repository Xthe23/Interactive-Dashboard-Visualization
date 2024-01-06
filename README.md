# [Github Pages Version](https://xthe23.github.io/belly-button-challenge/)

# Introduction
Welcome to the Belly Button Biodiversity Dashboard! This interactive dashboard was made using d3.js and plotly.js in Visual Studio Code. The dashboard is designed to explore the fascinating Belly Button Biodiversity dataset, provided to me by the University of Central Florida, which catalogs the diverse array of microbes inhabiting human navels. This dataset is a window into the microscopic world of our own bodies, revealing that a few microbial species, or operational taxonomic units (OTUs), are common in the majority of people, while others are found less frequently.
<div align="center">
  <img src="https://github.com/Xthe23/belly-button-challenge/blob/main/Images/sc2.png" width="1000" height="600">
</div>

# Project Overview
In this assignment, I delved into the Belly Button Biodiversity dataset provided by UCF to uncover the microbial landscape of human navels. My goal is to visualize this data in an engaging and informative way. I have developed an interactive dashboard that allows users to explore the dataset through various visualizations, including bar charts and bubble charts. I took a very methodical and modularized approach within the app.js, creating 11 custom functions all being triggered by 1 custom function.

Below is a snippet of the `app.js` file used in this project. 
For the complete code, please [click here](https://github.com/Xthe23/belly-button-challenge/blob/main/static/js/app.js).

```javascript
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
```

<div align="center">
  <img src="https://github.com/Xthe23/belly-button-challenge/blob/main/Images/sc3.png" width="1000" height="600">
</div>




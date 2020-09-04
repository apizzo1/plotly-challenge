# plotly-challenge

## Dashboard details

This challenge was to create a dashboard which details the different types of microbes that can be found in human belly buttons. The dashboard uses data from the following source: 
* Hulcr, J. et al.(2012) A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable. Retrieved from: http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/

The dashboard includes a dropdown menu, which allows the user to select which test subject's data they would like to view. Once a test subject is selected, the dashboard updates all the plots, as well as the Demographic Info panel and page header, to the selected test subject.

### About the Plots

There is a Demographics Info panel, which shows the metadata for the selected test subject, including, id, ethnicity, gender, age, location, belly button type (bbtype) and weekly washing frequency (wfreq). When a new test subject is selected, this panel will update to the selected test subject's data.

The horizontal bar plot shows the top ten OTUs (operational taxonomic units) found in the test subject, as well as the number of samples of that OTU that were present in the test subject. If the user hovers over any of the bars, the OTU label will appear, showing the type of bacteria that is represented.

The bubble plot shows all the OTUs (operational taxonomic units) found in the test subject, with the x axis showing the OTU ID and the y axis showing the number of OTUs that were found. The bubble size corresponds to the sample values and the bubble color corresponds to the OTU ID. If the user hovers over the bubbles, they will again see the type of bacteria that is represented (OTU label).

The gauge plot shows the belly button washing frequency of the test subject per week. This is a visualization of the wfreq value that can be seen in the Demographic Info panel.

### Files Included

A basic index.html file is used to visualize the data. This file was provided as a template to be used in this assignment. Slight modifications were made to the index.html (such as adding a header that displays the test subject ID), but otherwise, the focus of this assignment was on the app.js file.

The app.js file reads in the bellybutton data from a json file, found in the data folder. 

The app.js file includes an init() function, which creates a default dashboard that will be seen when the page is loaded, without requiring the user to select anything. The default plots show data for Test Subject 940, as this is the option that is seen on the menu bar when the page is loaded.

If the user selects a different test subject from the menu, this 'change' action will invoke the updateDashboard() function in the app.js file. This function restyles all the plots to show the data for the selected test subject. It also updates the demographic information panel and the page header to reflect the selected test subject.
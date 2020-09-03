
// Use the D3 library to read in samples.json.

d3.json("data/samples.json").then((data) => {
    console.log(data);

    // bring in list of names
    var names = data.names;
    console.log(names);

    // // adding values to drop down menu
    var menu_select = d3.select("#selDataset");
    names.forEach(function (name) {
        var option = menu_select.append("option").text(name);
        option.attr("value", `option${name}`);
    })

    // bring in samples_values arrays from json
    var sample_values_array = data.samples.map(row => row.sample_values);
    console.log(sample_values_array);
    // bring in otu_ids arrays from json
    var otu_ids = data.samples.map(row => row.otu_ids);
    console.log(otu_ids);
    // bring in otu_labels from json
    var otu_labels = data.samples.map(row => row.otu_labels);
    console.log(otu_labels);

    // slice the arrays to show only the top 10 OTUs found in the individual

    // create empty arrays
    var top_sample_values = [];
    var top_otu_ids = [];
    var top_otu_labels = [];

    // slice top 10 sample values
    sample_values_array.forEach(function (array) {
        var top_ten_sample_values = array.slice(0, 10);
        top_sample_values.push(top_ten_sample_values);
    })
    console.log(top_sample_values);

    // slice top ten otu_ids
    otu_ids.forEach(function (array) {
        var top_ten_otu_ids = array.slice(0, 10);
        // adding 'OTU' to the beginning of each array element
        // source: https://stackoverflow.com/questions/20498409/adding-text-to-beginning-of-each-array-element
        top_ten_otu_ids = top_ten_otu_ids.map(i => 'OTU ' + i);
        top_otu_ids.push(top_ten_otu_ids);
    })

    console.log(top_otu_ids);

    // slice top ten otu_labels
    otu_labels.forEach(function (array) {
        var top_ten_otu_labels = array.slice(0, 10);
        top_otu_labels.push(top_ten_otu_labels);
    })

    console.log(top_otu_labels);

    // find div where test subject header will be applied
    var subject_header = d3.select(".title");


    // Add default plots - default is test subject 940
    function init() {

         // plotting data in horizontal bar chart using patient index number
         var trace0 = {
            type: 'bar',
            // Use sample_values as the values for the bar chart.
            x: top_sample_values[0],
            // Use otu_ids as the labels for the bar chart.
            y: top_otu_ids[0],
            //  Use otu_labels as the hovertext for the chart.
            text: top_otu_labels[0],
            orientation: 'h'
        };
        // format plot with axes labels and title
        var layout = {
            title: `Top 10 OTUs found in Test Subject`,
            xaxis: {title: "Sample Values"},
            // reversing order of y axis
            // source: https://stackoverflow.com/questions/46201532/plotly-js-reversing-the-horizontal-bar-chart-in-plotly
            yaxis: {title: "OTU IDs", autorange: 'reversed'}
        };

        var bar_plot_data0 = [trace0];
        // plot bar plot
        Plotly.newPlot("bar", bar_plot_data0, layout);

        var trace0_2 = {
            // Use otu_ids for the x values.
            x: otu_ids[0],
            // Use sample_values for the y values.
            y: sample_values_array[0],
            mode: 'markers',
            // Use sample_values for the marker size.
            // Use otu_ids for the marker colors.
            marker: {color: otu_ids[0],  size: sample_values_array[0] },
            
            // Use otu_labels for the text values.
            text: otu_labels[0]
        }

        var layout_bubble_0 = {
            title: `All OTUs for Test Subject`,
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"},
            plot_bgcolor:"darkgray"
        }

        var bubble_plot_data_0 = [trace0_2];
        // plot bubble plot
        Plotly.newPlot("bubble", bubble_plot_data_0, layout_bubble_0);

        
        var trace0_3 = 
        {
            // reference the demographics data for the test subject to get washing frequency
            value: data.metadata[0].wfreq,
            title: { text: "Weekly Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9], tickmode: "linear", tick0: 0, dtick: 1},
                bar: { color: 'rgb(195,56,90)', thickness: 0.3},
                steps: [
                    //colors source:  https://plotly.com/python/builtin-colorscales/
                  { range: [0, 1], color: 'rgb(254,245,244)'},
                  { range: [1, 2], color: 'rgb(222,224,210)'},
                  { range: [2, 3], color: 'rgb(189,206,181)'},
                  { range: [3, 4], color: 'rgb(153,189,156)'},
                  { range: [4, 5], color: 'rgb(110,173,138)'},
                  { range: [5, 6], color: 'rgb(65,157,129)'},
                  { range: [6, 7], color: 'rgb(25,137,125)'},
                  { range: [7, 8], color: 'rgb(18,116,117)'},
                  { range: [8, 9], color: 'rgb(25,94,106)'}
                 ]}
        };

        var gauge_plot_data_0 = [trace0_3];
        // plot gauge plot
        Plotly.newPlot("gauge",gauge_plot_data_0);

        // Append header with test subject name
        subject_header.append('h2').text(`Dashboard for Test Subject ${names[0]}`);


         // print key:value pairs in Demographics Box for default test subject
         Object.entries(data.metadata[0]).forEach(([key, value]) => {
            var row = panel_body.append('div')
            row.attr("class", "demographics selection")
            row.text(`${key}: ${value}`);
         });
    
    }

    

    // event listener for menu option change
    d3.select("#selDataset").on("change", updateDashboard);

    // find demographics panel information on index.html
    var panel_body = d3.select(".panel-body");

    // event handler function
    function updateDashboard() {

        // remove any rows that currently exist from demographics panel
        panel_body.html("");
        // remove title, to be replaced with selected test subject title
        subject_header.html("");

        // get test subject choice from user
        var menu_choice = d3.selectAll("#selDataset");
        var chosen_subject = menu_choice.property("value");
        // remove 'option' from output text
        var option_choice = chosen_subject.substring(6);
        console.log(`option choice ${option_choice}`);
        // find index in names array of the test subject
        //  source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#:~:text=The%20indexOf()%20method%20returns,if%20it%20is%20not%20present.
        var patient_chosen = names.indexOf(option_choice);
        console.log(patient_chosen);

        // Append header with test subject name
        subject_header.append('h2').text(`Dashboard for Test Subject ${option_choice}`);

        // Demographics Data

        // Display each key-value pair from the metadata JSON object somewhere on the page.
        
        // Filter for the selected test subject using filter function
        function filter_metadata(test_subject) {
            return test_subject.id == option_choice;
        }
        // filter metadata for user selected test subject
        var demo_data = data.metadata.filter(filter_metadata);
        console.log(demo_data);

        // print key:value pairs in Demographics Box
        demo_data.forEach((subject) => {

            Object.entries(subject).forEach(([key, value]) => {
                // console.log(`${key}: ${value}`);
                var row = panel_body.append('div')
                row.attr("class", "demographics selection")
                row.text(`${key}: ${value}`);
            })
        });

        // Plotting

        // plotting data in horizontal bar chart using patient index number

        // Restyle bar plot from init() with selected test subject data
        var x_bar = top_sample_values[patient_chosen];
        var y_bar = top_otu_ids[patient_chosen];
        var text_bar = top_otu_labels[patient_chosen];
        Plotly.restyle("bar", "x", [x_bar]);
        Plotly.restyle("bar", "y", [y_bar]);
        Plotly.restyle("bar", "text", [text_bar]);


        // // Create a bubble chart that displays each sample.

        // Restyle bubble plot from init() with selected test subject data
        var x_bubble = otu_ids[patient_chosen];
        var y_bubble = sample_values_array[patient_chosen];
        var marker_bubble = {color: otu_ids[patient_chosen],  size: sample_values_array[patient_chosen]};
        var text_bubble = otu_labels[patient_chosen];
        Plotly.restyle("bubble", "x", [x_bubble]);
        Plotly.restyle("bubble", "y", [y_bubble]);
        Plotly.restyle("bubble", "marker", [marker_bubble]);
        Plotly.restyle("bubble", "text", [text_bubble]);

        // Gauge plot to plot the weekly washing frequency of the individual.
        // get wash frequency 
        console.log(demo_data[0].wfreq);

        // Restyle Gauge plot from init() with selected test subject data
        // reference the demographics data for the test subject to get washing frequency
        var value_gauge = demo_data[0].wfreq;
     
        Plotly.restyle("gauge","value",[value_gauge]);

    };

    // call init function to show defult plots on page
    init();

});
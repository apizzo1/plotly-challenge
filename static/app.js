// Use the D3 library to read in samples.json.

d3.json("../data/samples.json").then((data) => {
    console.log(data);

    // bring in list of names
    var names = data.names;
    console.log(names);

    // // adding values to menu
    var menu_select = d3.select("#selDataset");
    names.forEach(function (name) {
        var option = menu_select.append("option").text(name);
        option.attr("value", `option${name}`);
    })

    // bring in samples_values arrays
    var sample_values_array = data.samples.map(row => row.sample_values);
    console.log(sample_values_array);
    // bring in otu_ids arrays
    var otu_ids = data.samples.map(row => row.otu_ids);
    console.log(otu_ids);
    // bring in otu_labels
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

    // event listener for menu option change
    d3.select("#selDataset").on("change", updateDashboard);

    // event handler function
    function updateDashboard() {

        var menu_choice = d3.selectAll("#selDataset");
        var chosen_subject = menu_choice.property("value");
        // remove 'option' from output text
        var option_choice = chosen_subject.substring(6);
        console.log(`option choice ${option_choice}`);
        // find index in names array of the test subject
        //  source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#:~:text=The%20indexOf()%20method%20returns,if%20it%20is%20not%20present.
        var patient_chosen = names.indexOf(option_choice);
        console.log(patient_chosen);

        // Demographics Data

        // Display each key-value pair from the metadata JSON object somewhere on the page.
        // find panel information on index.html
        var panel_body = d3.select(".panel-body");

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
        var trace = {
            type: 'bar',
            // Use sample_values as the values for the bar chart.
            x: top_sample_values[patient_chosen],
            // Use otu_ids as the labels for the bar chart.
            y: top_otu_ids[patient_chosen],
            //  Use otu_labels as the hovertext for the chart.
            text: top_otu_labels[patient_chosen],
            orientation: 'h'
        };
        // format plot with axes labels and title
        var layout = {
            title: `Top 10 OTUs found in Test Subject ${option_choice}`,
            xaxis: {title: "Sample Values"},
            // reversing order of y axis
            // source: https://stackoverflow.com/questions/46201532/plotly-js-reversing-the-horizontal-bar-chart-in-plotly
            yaxis: {title: "OTU IDs", autorange: 'reversed'}
        };

        var bar_plot_data = [trace];

        Plotly.newPlot("bar", bar_plot_data, layout);

        
        // Create a bubble chart that displays each sample.
        var trace2 = {
            // Use otu_ids for the x values.
            x: otu_ids[patient_chosen],
            // Use sample_values for the y values.
            y: sample_values_array[patient_chosen],
            mode: 'markers',
            // Use sample_values for the marker size.
            // Use otu_ids for the marker colors.
            marker: {color: otu_ids[patient_chosen],  size: sample_values_array[patient_chosen] },
            
            // Use otu_labels for the text values.
            text: otu_labels[patient_chosen]
        }

        var layout_bubble = {
            title: `All OTUs for Test Subject ${option_choice}`,
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"}
        }

        var bubble_plot_data = [trace2];

        Plotly.newPlot("bubble", bubble_plot_data, layout_bubble);


    };

});
// Use the D3 library to read in samples.json.

d3.json("../data/samples.json").then((data) => {
    console.log(data);

    // bring in list of names
    var names = data.names;
    console.log(names);

    // adding values to menu
    var menu_select = d3.select("#selDataset");
    names.forEach(function(name) {
        var option = menu_select.append("option").text(name);
        option.attr("value", `option${name}`);
    })

    // bring in samples_values arrays
    var sample_values_array = data.samples.map(row=>row.sample_values);
    console.log(sample_values_array);
    // bring in otu_ids arrays
    var otu_ids = data.samples.map(row=>row.otu_ids);
    console.log(otu_ids);
    // bring in otu_labels
    var otu_labels = data.samples.map(row=>row.otu_labels);
    console.log(otu_labels);

    // slice the arrays to show only the top 10 OTUs found in the individual

    // create empty arrays
    var top_sample_values = [];
    var top_otu_ids = [];
    var top_otu_labels = [];

    // slice top 10 sample values
    sample_values_array.forEach(function(array) {
        var top_ten_sample_values = array.slice(0,10);
        top_sample_values.push(top_ten_sample_values);
    })
    console.log(top_sample_values);

    // slice top ten otu_ids
    otu_ids.forEach(function(array) {
        var top_ten_otu_ids = array.slice(0,10);
        // adding 'OTU' to the beginning of each array element
        // source: https://stackoverflow.com/questions/20498409/adding-text-to-beginning-of-each-array-element
        top_ten_otu_ids = top_ten_otu_ids.map(i => 'OTU ' + i);
        top_otu_ids.push(top_ten_otu_ids);
    })

    console.log(top_otu_ids);

    // slice top ten otu_labels
    otu_labels.forEach(function(array) {
        var top_ten_otu_labels = array.slice(0,10);
        top_otu_labels.push(top_ten_otu_labels);
    })

    console.log(top_otu_labels);

    // get index from value in array:
    //  source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#:~:text=The%20indexOf()%20method%20returns,if%20it%20is%20not%20present.
    console.log(names.indexOf('941'));

    // event listener for menu option change
    d3.select("#selDataset").on("change", updateDashboard);

    // event handler function
    function updateDashboard() {
        var menu_choice = d3.select("#selDataset");
        var chosen_subject = menu_choice.property("value");
        // remove 'option' from output text
        var option_choice = chosen_subject.substring(6);
        console.log(option_choice);

        // plotting data in horizontal bar chart
        var trace = {
            type: 'bar',
            // Use sample_values as the values for the bar chart.
            x: top_sample_values[0],
            // Use otu_ids as the labels for the bar chart.
            y: top_otu_ids[0],
            //  Use otu_labels as the hovertext for the chart.
            text: top_otu_labels[0],
            orientation: 'h'
        }

        var plot_data = [trace];

        Plotly.newPlot("bar", plot_data);
    }

    
});
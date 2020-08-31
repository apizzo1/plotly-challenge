// Use the D3 library to read in samples.json.

d3.json("../data/samples.json").then((data) => {
    console.log(data);

    // bring in list of names
    var names = data.names;
    console.log(names);
    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
//  Use otu_labels as the hovertext for the chart.

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
        // https://stackoverflow.com/questions/20498409/adding-text-to-beginning-of-each-array-element
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


    var trace = {
        type: 'bar',
        y: top_otu_ids[0],
        x: top_sample_values[0],
        text: top_otu_labels[0],
        orientation: 'h'
    }

    var plot_data = [trace];

    Plotly.newPlot("bar", plot_data);
});
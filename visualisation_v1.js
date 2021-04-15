function init() {
    var margin = { top: 10, right: 30, bottom: 30, left: 60 };
    var width = 600 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var dataset = [];
    d3.csv("./dv_final_dataset.csv").then(function (data) {
        dataset = data;
        data.forEach(function (d) {
            d.gdp = d.gdp;
        });

        ScatterPlot(dataset);
    });

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function ScatterPlot(dataset) {
        console.log(d3.min(dataset, d => d.population))
        console.log(d3.min(dataset, d => d.total_solid_waste_generated_tons_year))

        var xScale = d3.scaleLinear()
            .domain([0,
                d3.max(dataset, function (d) {
                    return d.population;
                })])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0,
                d3.max(dataset, function (d) {
                    return d.total_solid_waste_generated_tons_year;
                })])
            .range([height, 0]);

        var xAxis = SVG.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var yAxis = SVG.append("g")
            .call(d3.axisLeft(y));

        var clip = SVG.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);
        
        var scatter = SVG.append('g')
            .attr("clip-path", "url(#clip)")


        scatter.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d.population);
            })
            .attr("cy", function (d) {
                return yScale(d.total_solid_waste_generated_tons_year);
            })
            .attr("r", 5)
            .attr("fill", "slategrey");

        var zoom = d3.zoom()
            .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
            .extent([[0, 0], [width, height]])
            .on("zoom", updateChart);

        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        svg.append("rect")
            .attr("width", w)
            .attr("height", h)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);

        function updateChart() {

            // recover the new scale
            var newX = d3.event.transform.rescaleX(x);
            var newY = d3.event.transform.rescaleY(y);

            // update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX))
            yAxis.call(d3.axisLeft(newY))

            // update circle position
            scatter
                .selectAll("circle")
                .attr('cx', function (d) { return newX(d.population) })
                .attr('cy', function (d) { return newY(d.total_solid_waste_generated_tons_year) });
        }
    }

}

window.onload = init;
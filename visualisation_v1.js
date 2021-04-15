function init() {
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1500 - margin.left - margin.right,
        height = 630 - margin.top - margin.bottom;

    var SVG = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    d3.csv("./dv_final_dataset.csv").then(function (data) {

        var x = d3.scaleLinear()
            .domain([0,d3.max(data, d => d.population)])
            .range([0, width]);

        var xAxis = SVG.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0,d3.max(data, d => d.gdp)])
            .range([height, 0]);

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

        scatter
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.population); })
            .attr("cy", function (d) { return y(d.gdp); })
            .attr("r", function (d) { return d.total_solid_waste_generated_tons_year/100000; })
            .style("fill", "#61a3a9")
            .style("opacity", 0.5)

        var zoom = d3.zoom()
            .extent([[0, 0], [width, height]])
            .on("zoom", function(event, d){
                var newX = event.transform.rescaleX(x);
                var newY = event.transform.rescaleY(y);
    
                xAxis.call(d3.axisBottom(newX))
                yAxis.call(d3.axisLeft(newY))
    
                scatter
                    .selectAll("circle")
                    .attr('cx', function (d) { return newX(d.population) })
                    .attr('cy', function (d) { return newY(d.gdp) });
            })

        SVG.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);
        

    })

}

window.onload = init;
import * as d3 from "d3";

function drowGraph(data) {
    let w = 1000;
   let h = 550;

   let graph = data;

    let svg = d3.select(".graph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    svg.style('fill', 'rgba(51,51,51,0.2)');

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(w / 2, h / 2));

        let link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");

    link.attr('stroke', function (d) {return d.value});


        let node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr('fill', function (d) {if(d.index == 0){return 'red';}})
            .attr('r', function (d) {if(d.index == 0){return '8';}})
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

    let myText = svg.selectAll(".mytext")
        .data(graph.nodes)
        .enter()
        .append("text");
    //the rest of your code

    node
        .append("title")
        .text(function(d) { return d.id; });

    myText
        .style("fill", "#333")
        .attr("width", "6")
        .attr("height", "6")
        .attr('font-size', '10px')
        .attr("font-weight","bold")
        .attr("font-family","Arial")
        .text(function(d) { return 'id-' + d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            myText
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
        }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }





}


export default drowGraph;
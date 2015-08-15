var arcIndex = 0;
drawPie = function(){
    var dataset = [
                    {
                        value: 25,
                        inner: 
                        [
                            {
                                value: 10,
                                inner: 
                                [
                                    {
                                        value: 3
                                    },
                                    {
                                        value: 7
                                    }
                                   ]
                            },
                            {
                                value: 15
                            }
                        ]
                    },
                    {
                        value: 50,
                        inner:
                        [
                            {
                                value: 15
                            },
                            {
                                value: 35,
                                inner:
                                [
                                    {
                                        value: 5
                                    },
                                    {
                                        value: 30
                                    }
                                ]
                            }
                        ]
                    }
                ];
    var svg = d3.select("#"+"chartContainer")
        .append("svg")
        .attr("id", "chartContainer"+"_svg")
        .attr("width", 600)
        .attr("height", 600);
    var color = d3.scale.category20();
    draw(svg, color, 0, 300, dataset, 0, 50, 0, 360*22/7/180);
}


var customArcTween = function(d) {
        var start = {
            startAngle: d.startAngle,
            endAngle: d.startAngle
        };
        var interpolate = d3.interpolate(start, d);
        return function(t) {
            return d.arc(interpolate(t));
        };
    };

draw = function(svg, color, colorIndex, totalRadius, dataset, innerRadius, outerRadius, startAngle, endAngle) {
    console.log("**** draw ****");
    console.log("dataset = " + dataset);
    if(dataset === null || dataset ===undefined){
        return;
    }
    // console.log("innerRadius = " + innerRadius);
    // console.log("outerRadius = " + outerRadius);
    console.log("colorIndex = " + colorIndex);
    // console.log("startAngle = " + startAngle);
    // console.log("endAngle = " + endAngle);

var storeMetadataWithArc = function(d) {
        d.arc = arc;
    };


    var pie = d3.layout.pie();
    pie.value(function(d) {
        //console.log("d.value = " + d.value);
        return d.value;
    });
    pie.startAngle(startAngle)
        .endAngle(endAngle);
    
    var values = [];
    for(var i=0; i<dataset.length; i++){
        values.push(dataset[i].value);
        if(dataset[i].value===35){
            console.log("breakss now");
        }
    }
    console.log(values);

    var arc = d3.svg.arc().innerRadius(innerRadius)
            .outerRadius(outerRadius);
    //Set up groups
    var clazz = "arc" + arcIndex++;

    var arcs = svg.selectAll("g." + clazz)
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc " + clazz)
        .attr("transform",
                "translate(" + (totalRadius) + "," + (totalRadius) + ")");

    //Draw arc paths
    var paths = arcs.append("path")
                .attr("fill", color(arcIndex));

    paths.each(storeMetadataWithArc);

    paths.transition()
        .duration(1000)
        .delay(1000*arcIndex)
        .ease("linear")
        .attrTween("d", customArcTween);

    //paths.each(storeMetadataWithArc);

    console.log("paths.data() = " + paths.data());
    for(var j=0; j< dataset.length; j++){
        console.log("dataset[j] = " + dataset[j]);
        //console.log("paths.data()[j] = " + paths.data()[j]);
        if(dataset[j].inner !== undefined){
            draw(svg, color, ++colorIndex, totalRadius, dataset[j].inner, innerRadius+50, outerRadius+50, paths.data()[j].startAngle, paths.data()[j].endAngle);    
        }

    }


};

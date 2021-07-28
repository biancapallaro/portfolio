(function () {

  const margin = { top: 40, right: 30, bottom: 20, left: 40 }

  const width = 500 - margin.left - margin.right
  const height = 600 - margin.top - margin.bottom

  // You'll probably need to edit this one
  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // i'll give you between 0-50k
  // you give back between 0-width (left hand side
  // to the right hand side)
  const xPositionScale = d3.scaleLinear()
    .domain([0, 45])
    .range([0, width])

  const yPositionScale = d3.scaleLinear()
    .domain([0, 60])
    .range([height, 0])

  const colorScale = d3.scaleOrdinal()
    .range(['#FFB97F','#A6DEC2','#75B6D8','#CCCCCC','#FDF3B5','#fff2ae','#f1e2cc','#cccccc'])

  // hey d3! read in countries.csv
  // and when you're done, go run 'ready'
  d3.csv("hiv.csv")
    .then(ready)

  function ready (datapoints) {
    // add one circle to the 
    // svg for each datapoint

    // grab all circles inside of the svg
    // attach the datapoints to the circles
    // make sure we have the right num of circles
    svg.selectAll('circle')
      .data(datapoints, d => d.hiv)
      .join('circle')
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.Poverty))
      .attr('cy', d => yPositionScale(d.HIV))
      .attr('fill', d => colorScale(d.Borough))

    d3.select("#step-1").on('stepin', function() {


      })

      d3.select("#step-2").on('stepin', function() {
        // If you aren't Asia, you're grey
        d3.selectAll('circle')
          .filter(d => d.Borough !== 'Bronx')
          .transition()
          .attr('fill', 'lightgrey')
  
        // if you're Asia, you get a stroke
        d3.selectAll('circle')
          .filter(d => d.Borough === 'Bronx')
          .transition()
          .attr('stroke', 'black')
          .raise()
      })
  
      d3.select("#step-2").on('stepout', function() {
        // Reset fill and stroke when scrolling back to top
        d3.selectAll('circle')
          .transition()
          .attr('fill', d => colorScale(d.Borough))
          .attr('stroke', 'black')
      })
    
      d3.select("#step-3").on('stepin', function() {
        // We only want there to be circles for africa
        let nei = datapoints.filter(d => d.Poverty > 38)
  
        svg.selectAll('circle')
          .data(nei, d => d.uhf_neigh)
          .join('circle')
          .attr('r', 5)
          .attr('cx', d => xPositionScale(d.Poverty))
          .attr('cy', d => yPositionScale(d.HIV))
          .attr('fill', d => colorScale(d.Borough))
          .attr('stroke', 'black')
        })

    d3.select("#step-4").on('stepin', function() {
      // We only want there to be circles with a low life expectancy
      svg.selectAll('circle')
      .data(datapoints, d => d.hiv)
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.Poverty))
      .attr('cy', d => yPositionScale(d.HIV))
      .attr('fill', d => colorScale(d.Borough))
        .join(
          enter => enter.append('circle')
                        .attr('cx', d => xPositionScale(d.Poverty))
                        .attr('cy', d => yPositionScale(d.HIV))
                        .attr('fill', d => colorScale(d.Borough))
                        .transition()
                        .attr('r', 5),
          exit => exit.transition().attr('r', 0).remove()
        )
    })

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    }

})();
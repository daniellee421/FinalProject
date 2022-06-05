let previousYear = 0;
let year = 1985;

function BarChartRace(chartId, extendedSettings) {
    const chartSettings = {
      width: 800,
      height: 800,
      padding: 140,
      titlePadding: 5,
      columnPadding: 0.4,
      ticksInXAxis: 5,
      duration: 3500,
      ...extendedSettings
    };

    let colors = d3.scaleOrdinal(d3.schemeCategory10);
  
    chartSettings.innerWidth = chartSettings.width - chartSettings.padding * 2;
    chartSettings.innerHeight = chartSettings.height - chartSettings.padding * 2;
  
    const chartDataSets = [];
    let year = 1983;
    let chartTransition;
    let timerStart, timerEnd;
    let currentDataSetIndex = 0;
    let elapsedTime = chartSettings.duration;
  
    const chartContainer = d3.select(`#${chartId} .chart-container`);
    const xAxisContainer = d3.select(`#${chartId} .x-axis`);
    const yAxisContainer = d3.select(`#${chartId} .y-axis`);
  
    const xAxisScale = d3.scaleLinear().range([0, chartSettings.innerWidth]);
  
    const yAxisScale = d3
      .scaleBand()
      .range([0, chartSettings.innerHeight])
      .padding(chartSettings.columnPadding);
  
    d3.select(`#${chartId}`)
      .attr("width", chartSettings.width)
      .attr("height", chartSettings.height);
  
    chartContainer.attr(
      "transform",
      `translate(${chartSettings.padding} ${chartSettings.padding})`
    );
  
    chartContainer
      .select(".current-date")
      .attr(
        "transform",
        `translate(${chartSettings.innerWidth} ${chartSettings.innerHeight})`
      );
  
    function draw({ dataSet, date: currentDate }, transition) {
      const { innerHeight, ticksInXAxis, titlePadding } = chartSettings;
      const dataSetDescendingOrder = dataSet.sort(
        ({ count: firstValue }, { count: secondValue }) =>
          secondValue - firstValue
      );
  
      chartContainer.select(".current-date").text(currentDate);
  
      xAxisScale.domain([0, dataSetDescendingOrder[0].count]);
      yAxisScale.domain(dataSetDescendingOrder.map(({ school }) => school));
  
      xAxisContainer.transition(transition).call(
        d3
          .axisTop(xAxisScale)
          .ticks(ticksInXAxis)
          .tickSize(-innerHeight)
      );
  
      yAxisContainer
        .transition(transition)
        .call(d3.axisLeft(yAxisScale).tickSize(0));
  
      // The general update Pattern in d3.js
  
      // Data Binding
      const barGroups = chartContainer
        .select(".columns")
        .selectAll("g.column-container")
        .data(dataSetDescendingOrder, ({ school }) => school);
  
      // Enter selection
      const barGroupsEnter = barGroups
        .enter()
        .append("g")
        .attr("class", "column-container")
        .attr("transform", `translate(0,${innerHeight})`);
  
      barGroupsEnter
        .append("rect")
        .attr("fill", function(d,i){return colors(i)})
        .attr("class", "column-rect")
        .attr("width", 0)
        .attr("height", 30); // yAxisScale.step() * (1 - chartSettings.columnPadding)
  
      barGroupsEnter
        .append("text")
        .attr("class", "column-title")
        .attr("y", 30) // (yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2
        .attr("x", -titlePadding+15)
        .text(({ school }) => school);
  
      barGroupsEnter
        .append("text")
        .attr("class", "column-count")
        .attr("y", 50) // (yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2
        .attr("x", titlePadding)
        .text(0);
  
      // Update selection
      const barUpdate = barGroupsEnter.merge(barGroups);
  
      barUpdate
        .transition(transition)
        .attr("transform", ({ school }) => `translate(0,${yAxisScale(school)})`)
        .attr("fill", "normal");
  
      barUpdate
        .select(".column-rect")
        .transition(transition)
        .attr("width", ({ count }) => xAxisScale(count));
  
      barUpdate
        .select(".column-title")
        .transition(transition)
        .attr("x", ({ count }) => {
          return xAxisScale(count) - titlePadding
        });
  
      barUpdate
        .select(".column-count")
        .transition(transition)
        .attr("x", ({ count }) => xAxisScale(count) + titlePadding)
        .tween("text", function({ count }) {
          const interpolateStartValue =
            elapsedTime === chartSettings.duration
              ? this.currentValue || 0
              : +this.innerHTML;
  
          const interpolate = d3.interpolate(interpolateStartValue, count);
          this.currentValue = count;

         
  
          return function(t) {
            
            //if(t>0.998){
            //   year+=1;
            //   d3.select("#date").html(year+t);
            // }else{
            //   d3.select("#date").html(year+t);
            // }
            if(previousYear>t){
              year++;
            }
            previousYear = t;
            d3.select("#date").html(year);
            d3.select(this).text(Math.ceil(interpolate(t)));
          };
        });
  
      // Exit selection
      const bodyExit = barGroups.exit();
  
      bodyExit
        .transition(transition)
        .attr("transform", `translate(0,${innerHeight})`)
        .on("end", function() {
          d3.select(this).attr("fill", "none");
        });
  
      bodyExit
        .select(".column-title")
        .transition(transition)
        .attr("x", 0);
  
      bodyExit
        .select(".column-rect")
        .transition(transition)
        .attr("width", 0);
  
      bodyExit
        .select(".column-value")
        .transition(transition)
        .attr("x", titlePadding)
        .tween("text", function() {
          const interpolate = d3.interpolate(this.currentValue, 0);
          this.currentValue = 0;
  
          return function(t) {
      
            d3.select(this).text(Math.ceil(interpolate(t)));
          };
        });
  
      return this;
    }
  
    function addDataset(dataSet) {
      chartDataSets.push(dataSet);
  
      return this;
    }
  
    function addDatasets(dataSets) {
      chartDataSets.push.apply(chartDataSets, dataSets);
  
      return this;
    }
  
    function setTitle(title) {
      d3.select(".chart-title")
        .attr("x", chartSettings.width / 2)
        .attr("y", -chartSettings.padding / 2)
        .text(title);
  
      return this;
    }
  
    /* async function render() {
      for (const chartDataSet of chartDataSets) {
        chartTransition = chartContainer
          .transition()
          .duration(chartSettings.duration)
          .ease(d3.easeLinear);
  
        draw(chartDataSet, chartTransition);
  
        await chartTransition.end();
      }
    } */
  
    async function render(index = 0) {
      currentDataSetIndex = index;
      timerStart = d3.now();
  
      chartTransition = chartContainer
        .transition()
        .duration(elapsedTime)
        .ease(d3.easeLinear)
        .on("end", () => {
          if (index < chartDataSets.length) {
            elapsedTime = chartSettings.duration;
            render(index + 1);
          } else {
            d3.select("button").text("Play");
          }
        })
        .on("interrupt", () => {
          timerEnd = d3.now();
        });
  
      if (index < chartDataSets.length) {
        draw(chartDataSets[index], chartTransition);
      }
  
      return this;
    }
  
    function stop() {
      d3.select(`#${chartId}`)
        .selectAll("*")
        .interrupt();
  
      return this;
    }
  
    function start() {
      elapsedTime -= timerEnd - timerStart;
  
      render(currentDataSetIndex);
  
      return this;
    }
  
    return {
      addDataset,
      addDatasets,
      render,
      setTitle,
      start,
      stop
    };
  }
  
d3.json("colleges.json").then((data) => {
    console.log(data[0].dataSet.find(d => d.school == "Kentucky"));
    console.log(data[43].dataSet.find(d => d.school == "Kentucky"));

    // modify your data

    data = data.sort((a, b) => (a.year > b.year) ? 1 : -1);

    for (let y = 1; y < 44; y++) {
       
        for (let c = 0; c < data[y].dataSet.length; c++) {
    
                data[y].dataSet[c].count += data[y - 1].dataSet[c].count;
        }
    }

  
    

    let numYears = data.length;
    for (let y = 0; y < numYears; y++) {
        data[y].dataSet = data[y].dataSet.filter(d => d.count > 5);

        data[y].dataSet = data[y].dataSet.filter(f => f.school != 'None');
    }

    data = data.filter(d => d.year && +d.year > 1988);
    console.log(data);

    //

    // console.log(data);





    const myChart = new BarChartRace("bar-chart-race");

    myChart.setTitle("Bar Chart Race Title").addDatasets(data).render();
});

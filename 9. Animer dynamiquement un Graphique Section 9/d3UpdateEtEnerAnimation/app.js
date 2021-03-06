const svg = d3.select('.box')
              .append('svg')
              .attr('width', 600)
              .attr('height', 550)
              .style('background', 'AntiqueWhite');


// Dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
                 .attr('width', graphWidth)
                 .attr('height', graphHeight)
                 .attr('transform', `translate(${margin.left}, ${margin.top})`);

const groupeX = graph.append('g')
                     .attr('transform', `translate(0, ${graphHeight})`);
const groupeY = graph.append('g')


// Range et scale
const y = d3.scaleLinear()
              .range([graphHeight, 0]);

const x = d3.scaleBand()
              .range([0, 480])
              .paddingInner(0.3)
              .paddingOuter(0.2)

// Création et mise en place des Axes

const axeX = d3.axisBottom(x)
const axeY = d3.axisLeft(y)
               .ticks(5)
               .tickFormat(d => d + ' Euros');

// Fonction mis à jour

const maj = (donnee) => {

     // Domaines
     y.domain([0, d3.max(donnee, d => d.prix)]);
     x.domain(donnee.map(item => item.nom));

     // liaison des données       
    const rects = graph.selectAll('rect')
    .data(donnee);

    // mis à jour des rectangles déjà présent dans le dom
    rects.attr('width', x.bandwidth())
    .attr('fill', 'teal')
    .attr('x', function(d){return x(d.nom)})
    .transition()
    .duration(600)
    .attr('y', function(d){return y(d.prix)})
    .attr('height', function(d){return graphHeight - y(d.prix)});

    // fonction exit
    rects.exit().remove();

    // fonction enter
    rects.enter()
         .append('rect')
         .attr('width', x.bandwidth())
         .attr('height', 0)
         .attr('fill', 'teal')
         .attr('x', function(d){return x(d.nom)})
         .attr('y', graphHeight)
         .transition()
         .duration(600)
         .attr('y', function(d){return y(d.prix)})
         .attr('height', function(d){return graphHeight - y(d.prix)});
         
       // appel des axes
       groupeX.call(axeX)
       .style('font-size', "14px");
       groupeY.call(axeY)
       .style('font-size', "13px");

}

var donnee = [];

db.collection('pays').onSnapshot(res => {

 
       
       res.docChanges().forEach(change => {
           
              const doc = {...change.doc.data(), id: change.doc.id};

              switch(change.type){
                     case 'added':
                            donnee.push(doc);
                            break;
                     case 'modified':
                            const index = donnee.findIndex(item => item.id == doc.id);
                            donnee[index] = doc;
                            break;
                     case 'removed':
                            donnee = donnee.filter(item => item.id !== doc.id);
                            break;
                     default:
                            break;
              }
              
       })

       maj(donnee);

})
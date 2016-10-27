// Helpers.
// --------

function buildGraph(data) {
  var elements = [];
  var links = [];
    
  _.each(data.nodes, function(node) {
    elements.push(makeElement(node));
  })
  
  _.each(data.links, function(edge) {
    links.push(makeLink(edge)); 
  })
  return elements.concat(links);
}

function makeLink(edge) {
    
  var lnk = new joint.dia.Link({
      source: { id: edge.source.toString() },
      target: { id: edge.target.toString() },
      attrs: {
        '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' }
      },
      labels: [{
        position: 0.5,
        attrs: {
          text: {
            text: "on"
          }
        }
      }],
      connector: {name: 'smooth'}
  });
    
  //}
  
  return lnk;
}

function makeElement(node) {

    var maxLineLength = _.max(node.name.split('\n'), function(l) { return l.length; }).length;

    // Compute width/height of the rectangle based on the number
    // of lines in the label and the letter size. 0.6 * letterSize is
    // an approximation of the monospace font letter width.
    var letterSize = 8;
    var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    var height = 2 * ((node.name.split('\n').length + 1) * letterSize);

    return new joint.shapes.basic.Rect({
        id: node.id.toString(),
        size: { width: 100, height: height },
        attrs: {
            text: { 
              text: node.name, 
              'font-size': letterSize, 
              'font-family': 'monospace' },
            rect: {
                width: width, height: height,
                rx: 5, ry: 5,
                stroke: '#555'
            }
        }
    });
}

// Main.
// -----

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 2000,
    height: 2000,
    gridSize: 1,
    model: graph
});

// Just give the viewport a little padding.
V(paper.viewport).translate(20, 20);

$('#btn-layout').on('click', layout);

function layout() {
    
    try {
        var dataList = eval('dataList = ' + $('#adjacency-list').val());
    } catch (e) { alert(e); }
    
    var cells = buildGraph(dataList);
    graph.resetCells(cells);
    
    joint.layout.DirectedGraph.layout(graph, {
      setLinkVertices: false,
      nodeSep: 50,
      rankSep: 100
    });
}
layout();

// https://observablehq.com/@kaheetonaa/poi-map@163
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# POI MAP`
)});
  main.variable(observer("mapHeight")).define("mapHeight", function(){return(
600
)});
  main.variable(observer("container4")).define("container4", ["html","mapHeight"], function(html,mapHeight){return(
html`<div style="height:${mapHeight}px" />`
)});
  main.variable(observer("map4")).define("map4", ["mapboxgl","container4","poi","invalidation"], function*(mapboxgl,container4,poi,invalidation)
{
  // Create the \`map\` object with the mapboxgl.Map constructor, referencing
  // the container div
  let map = new mapboxgl.Map({
    container: container4,
    center: [105.819,21.035],
    zoom: 10,
    style: 'mapbox://styles/kuquanghuylcb/cklqzgcrv00qz17lqojvummxp',
    scrollZoom: true // helpful to disable this when embedding maps within scrollable webpages
  });

  // add navigation controls \(zoom buttons, pitch & rotate\)
  map.addControl(new mapboxgl.NavigationControl());

  map.addControl(new mapboxgl.FullscreenControl());
  
  map.on("load", function() {
    // add the source to the map styles
    map.addSource('POI', {
      type: 'geojson',
      data: poi,
    });
    
     map.addLayer({
      id: 'heatmap',
      type: 'heatmap',
      source: 'POI',
      'layout': {},
      'paint': {
        // this specifies how we style our data
        'heatmap-color': [
  "interpolate",
  ["linear"],
  ["heatmap-density"],
  0,
  "hsla(240, 20%, 55%, 0)",
  0.61,
  "hsla(0, 50%, 30%, 0.75)",
  1,
  "hsla(240, 33%, 39%, 0)"
],
        'heatmap-opacity': [
  "interpolate",
  ["linear"],
  ["zoom"],
  8,
  1,
  14,
  0.05
],
        'heatmap-radius':20
      }
    });
    
      map.addLayer({
      id: 'crashes',
      type: 'circle',
      source: 'POI',
      'layout': {},
      'paint': {
        // this specifies how we style our data
        'circle-color':[
  "interpolate",
  ["linear"],
  ["zoom"],
  11,
  "hsl(0, 15%, 30%)",
  14,
  "hsl(0, 33%, 39%)"
],
        'circle-opacity': [
  "interpolate",
  ["linear"],
  ["zoom"],
  11,
  0.5,
  14,
  1
],
        'circle-radius': [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            0.5,
            14,
            4
        ],
      }
    });
  })
  try {
    yield map;
    yield invalidation;
  } finally {
    map.remove();
  }
  
  
}
);
  main.variable(observer("poi")).define("poi", function(){return(
fetch("https://raw.githubusercontent.com/kaheetonaa/GFD/POI/02.geojson")
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Problem loading processed data!");
  })
)});
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require"], async function(require)
{
  let mapboxgl = await require('mapbox-gl@2.1.1');
  mapboxgl.accessToken = 'pk.eyJ1Ijoia3VxdWFuZ2h1eWxjYiIsImEiOiJja2V2N2p1dzUyM2U1MnVvZXRiZng3MGZ2In0.x3o3FGwULH6OSeamjZxJ7Q';
  
  return mapboxgl;
}
);
  main.variable(observer("mapboxglCSS")).define("mapboxglCSS", ["html"], function(html){return(
html`<link href='https://unpkg.com/mapbox-gl@2.1.1/dist/mapbox-gl.css' rel='stylesheet' />`
)});
  return main;
}

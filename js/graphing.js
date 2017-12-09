var myCorrelation = 0.00;
var mySampleSize = 100;
var initialValue = 0.00;

var xValues = [];
var yValues = [];

var rValueChoices = [-.99, -.9, -.8, -.7, -.6, -.5, -.3, 0.0, .3, .5, .6, .7, .8, .9, .99];
var correctRange = [-1.0,-.98, -.93, -.87, -.83, -.77, -.74, -.66, -.64,-.56, -.55, -.45, -.35, -.25, -.1, .1, .25, .35, .45, .55, .56, .64, .66, .74, .77, .83, .87, .93, .98, 1.0];

var closeRange = [-1.0, -.91, -.96, -.79, -.87, -.68, -.78, -.57, -.69, -.46, -.6, -.3, -.4, -.14, -.2, .2, .14, .4, .3, .6, .46, .69, .57, .78, .68, .87, .79, .96, .91, 1.0];





var actualR = 0;
var answerChecked = false;
var calculatedR = 0;

var timesGuessedXAxis = []
var differenceGuessedYAxis = []

var actualValueXAxis = []
var guessedValueYAxis = []

/// guess vs actual graphing (line from -2 to 2)
// guess - actual vs trials (line from 0 - end)

// See https://github.com/tulip/multivariate-normal-js for MVN

function roundForDisplay(value, decimals){


		var returnNumber = ''+Number(Math.round(value+'e'+decimals)+'e-'+decimals)
		var returnNumberStart = '' + returnNumber;
    if(returnNumber=="NaN"){
      returnNumber = "0.0";
      returnNumberStart = returnNumber;
    }
		var returnNumberEnd = '';


		//if (your_string.indexOf('hello') > -1)
		if(returnNumber.indexOf('.') > -1){
			var returnNumberChunks = returnNumber.split('.');
			returnNumberStart = returnNumberChunks[0];
			returnNumberEnd = returnNumberChunks[1];
		}

		while(returnNumberEnd.length < decimals){
			returnNumberEnd+= '0';
		}

  	return returnNumberStart + '.' + returnNumberEnd;
	}

  function round(value, decimals) {
  		var returnNumber = Number(Math.round(value+'e'+decimals)+'e-'+decimals)
    	return returnNumber;
  	};

// window.MultivariateNormal.default instead of mvn

//var setSampleSize = function(size){
//  mySampleSize = size;
//  getNewSamples();
//  drawChart2D();
//}

var getNewSample = function(){

// means of our three dimensions
  var meanVector = [0, 0];

  // covariance between dimensions. This examples makes the first and third
  // dimensions highly correlated, and the second dimension independent.
  var covarianceMatrix = [
      [ 1.0, actualR],
      [ actualR, 1.0],
  ];

  var distribution = window.MultivariateNormal.default(meanVector, covarianceMatrix);
  var currentSample = distribution.sample();
  return {
    x: currentSample[0],
    y: currentSample[1]
    };


}


function setSliderTicks(){
    var $slider =  $('#slider');
    var spacing =  50;

    $slider.find('.ui-slider-tick-mark').remove();
    for (var i = -.9; i < .9 ; i+=.1) {
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * (i + 1)) +  '%').appendTo($slider);
        $('<span class="ui-slider-tick-text">' + roundForDisplay(i,1) + '</span>').css('left', (spacing * (i + 1)) - 1 +  '%').css('top', '230%').appendTo($slider);
     }
}

(function( $, undefined ) {

    // Defines the custom implementation of the built-in slider widget.
    $.widget( "app.slider", $.ui.slider, {

        // The new "ticks" option defaults to false.
        options: {
            ticks: false
        },

        // Called when the slider is instantiated.
        _create: function() {

            // Call the orginal constructor, creating the slider normally.
            this._super();

            // Setup some variables for rendering the tick marks below the slider.
            var cnt = this.options.min,
                background = this.element.css( "border-color" ),
                left;

            while ( cnt < this.options.max ) {



                // Compute the "left" CSS property for the next tick mark.
                left = (( cnt / this.options.max * 100 ).toFixed( 2 ) / 2) + 50  + "%";



                // Creates the tick div, and adds it to the element. It adds the
                // "ui-slider-tick" class, which has common properties for each tick.
                // It also applies the computed CSS properties, "left" and "background".


                if((round(cnt,2) * 10 % 2) == 0)
                {$( "<div/>" ).html('<div class="ui-slider-tick" style="left: ' + left + '; background:rgb(128, 128, 128);"></div>' +
                      '<div class="ui-slider-tick-text" style="left: ' + left + ';color:	rgb(128, 128, 128); top:1.3em; margin-left: -.6em;">' + roundForDisplay(cnt,1) + '</div>')
                              .appendTo(this.element);}

                else if(isNaN((round(cnt,2)))){
                  $( "<div/>" ).html('<div class="ui-slider-tick" style="left: ' + left + '; background:rgb(128, 128, 128);"></div>' +
                        '<div class="ui-slider-tick-text" style="left: ' + left + ';color:	rgb(128, 128, 128); top:1.3em; margin-left: -.6em;">' + roundForDisplay(cnt,1) + '</div>')
                                .appendTo(this.element);
                }
                else{
                  {$( "<div/>" ).html('<div class="ui-slider-tick" style="left: ' + left + '; background:rgb(128, 128, 128);"></div>')
                                .appendTo(this.element);}
                }
                            //.addClass( "ui-slider-tick" )
                            // .appendTo( this.element )
                            // .css( { left: left, background: background } );


                cnt += this.options.step * 10;

            }

        }

    });

    var sliderTooltipSlide = function(event, ui) {
        myCorrelation = ui.value;
        if(isNaN(myCorrelation)){
          myCorrelation = 0.0;
        }
        var curValue = ui.value || initialValue;
        var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + roundForDisplay(curValue,2) + '</div><div class="tooltip-arrow"></div></div>';

        $('.ui-slider-handle').html(tooltip);

    }

    var sliderTooltipCreate = function(event, ui) {
        myCorrelation = ui.value;
        if(isNaN(myCorrelation)){
          myCorrelation = 0.0;
        }
        var curValue = ui.value || initialValue;
        var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + roundForDisplay(curValue,2) + '</div><div class="tooltip-arrow"></div></div>';

        $('.ui-slider-handle').html(tooltip);

    }

    $(function() {

        $( "#slider" ).slider({
            min: -1,
      			max: 1,
      			step: .01,
            create: sliderTooltipCreate,
            slide: sliderTooltipSlide,

        });

    });

})( jQuery );

var getNewSamples = function(){
  xValues = [];
  yValues = [];
  for(var i = 0; i < mySampleSize; i++){
    var currentSample = getNewSample();
    xValues[i] = currentSample.x;
    yValues[i] = currentSample.y;
  }
	calculatedR = ss.sampleCorrelation(xValues, yValues)
	calculatedR = round(calculatedR,2)

}

// draw charts with Plotly
var drawChart2D = function() {

	    var data = [{
	        x: xValues,
	        y: yValues,
	        mode: "markers",
	        type: "scattergl",
	        marker: { opacity: 0.7 }
	    }];

			Plotly.purge("renderTarget")

	    Plotly.newPlot("renderTarget", data,
      {
  				title:'',
  				xaxis: {
  						title: '',
  						range: [-4, 4],
  						autotick: false,
  						ticks: 'outside',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				yaxis:{
  						title:'',
  						range: [-4,4],
  						autotick: false,
  						ticks: '',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				font: {
  						size: 16,
  						family: 'Roboto Slab, serif',
  						color: '#3B317D'},
          margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
  			});


};

var drawChart2DWithLine = function() {

	    var data = {
	        x: xValues,
	        y: yValues,
	        mode: "markers",
	        type: "scattergl",
	        marker: { opacity: 0.7 }
	    };

			var l = ss.linearRegressionLine({ b: 0, m: calculatedR })


			var correctLine = {
				x: [-10, 10],
				y: [l(-10), l(10)],
				mode: 'lines',
				line: {
					color: '#FF6000',
					width: 1
				},
				type: "scattergl",
				name: '',
			};

			var data2 = [ data, correctLine ];


			Plotly.purge("renderTarget")

	    Plotly.newPlot("renderTarget", data2,
      {
  				title:'',
					showlegend: false,
  				xaxis: {
  						title: '',
  						range: [-4, 4],
  						autotick: false,
  						ticks: 'outside',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				yaxis:{
  						title:'',
  						range: [-4,4],
  						autotick: false,
  						ticks: '',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				font: {
  						size: 16,
  						family: 'Roboto Slab, serif',
  						color: '#3B317D'},
          margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
  			});



};

var drawBottomGraphs = function() {

	// trackedDifference

	var maxValue = 20
	if(timesGuessedXAxis.length > 20){
		maxValue = timesGuessedXAxis.length
	}

	var data = [{
			x: timesGuessedXAxis,
			y: differenceGuessedYAxis,
			mode: "markers",
			type: "scattergl",
			marker: { opacity: 0.7 }
	}];

	Plotly.purge("trackedDifference")


	Plotly.newPlot("trackedDifference", data,
	{
			title:'',
			xaxis: {
					zeroline: false,
					title: 'Trial',
					range: [-0.3, maxValue],
					autotick: false,
					ticks: 'outside',
					tick0: 0,
					dtick: 5,
					ticklen: 8,
					tickwidth: 0,
					tickcolor: '#000'},
			yaxis:{
					title:'Difference (Guess - Actual)',
					range: [-1,1],
					autotick: false,
					ticks: '',
					tick0: 0,
					dtick: .5,
					ticklen: 8,
					tickwidth: 0,
					tickcolor: '#000'},
			font: {
					size: 16,
					family: 'Roboto Slab, serif',
					color: '#3B317D'},
			margin: {
				l: 80,
				r: 50,
				b: 70,
				t: 50,
				pad: 5
			}
		});

// 	var data2 = [{
// 			x: actualValueXAxis,
// 			y: guessedValueYAxis,
// 			mode: "markers",
// 			type: "scattergl",
// 			marker: { opacity: 0.7 }
// 	}
//
// ];

var trace1 = {
  x: actualValueXAxis,
  y: guessedValueYAxis,
  mode: 'markers',
	type: "scattergl",
	name: '',
};

var correctLine = {
  x: [-5, 5],
  y: [-5, 5],
  mode: 'lines',
	line: {
    color: 'rgb(55, 128, 191)',
    width: 1
  },
	type: "scattergl",
	name: '',
};

var data2 = [ trace1, correctLine ];

	Plotly.purge("actualVSguess")

	Plotly.newPlot("actualVSguess", data2,
	{
			title:'',
			xaxis: {

					zeroline: false,
					title: 'Actual',
					range: [-1, 1],
					autotick: false,
					ticks: 'outside',
					tick0: 0,
					dtick: .5,
					ticklen: 8,
					tickwidth: 0,
					tickcolor: '#000'},
			yaxis:{

    			zeroline: false,


					title:'Guess',
					range: [-1,1],
					autotick: false,
					ticks: '',
					tick0: 0,
					dtick: .5,
					ticklen: 8,
					tickwidth: 0,
					tickcolor: '#000'},
			font: {
					size: 16,
					family: 'Roboto Slab, serif',
					color: '#3B317D'},
			margin: {
				l: 80,
				r: 50,
				b: 70,
				t: 50,
				pad: 5
			},
			showlegend: false
		});

}

var getANewGraph = function() {
	answerChecked = false;
	actualR = rValueChoices[Math.floor(Math.random()*rValueChoices.length)];
	document.getElementById('result').innerHTML = '&nbsp;';
	getNewSamples();
	drawChart2D();
}

var resetMyHistory = function(){

	getANewGraph()

	timesGuessedXAxis = []
	differenceGuessedYAxis = []

	actualValueXAxis = []
	guessedValueYAxis = []

	drawBottomGraphs()
}

var checkMyAnswer = function(){

	if(!answerChecked){

		answerChecked = true;

		var minCorrect = correctRange[rValueChoices.indexOf(actualR)*2]
		var maxCorrect = correctRange[rValueChoices.indexOf(actualR)*2 + 1]

		var minClose = closeRange[rValueChoices.indexOf(actualR)*2]
		var maxClose = closeRange[rValueChoices.indexOf(actualR)*2 + 1]

		var difference = actualR - calculatedR

		minCorrect = round(minCorrect - difference,2)
		maxCorrect = round(maxCorrect - difference,2)

		minClose = round(minClose - difference,2)
		maxClose = round(maxClose - difference,2)


		timesGuessedXAxis.push(timesGuessedXAxis.length)
		differenceGuessedYAxis.push(myCorrelation - round(calculatedR,2))

		actualValueXAxis.push(round(calculatedR,2))
		guessedValueYAxis.push(myCorrelation)

		drawBottomGraphs()

		if(minCorrect <= myCorrelation && myCorrelation <= maxCorrect){ // you were right!
			document.getElementById('result').innerHTML = "<font color='green'>That's correct! r = " + roundForDisplay(calculatedR,2) + "</font>";
		}
		else if(minClose <= myCorrelation && myCorrelation <= maxClose){ // you were close!
			document.getElementById('result').innerHTML = "<font color='#C9960C'>You were close! r = " + roundForDisplay(calculatedR,2) + "</font>";
		}
		else if(Math.abs(round(calculatedR,2) - myCorrelation) >= .99){ // critical wrong
			document.getElementById('result').innerHTML = "<font color='red'>That was a critical failure! Your guess was way off! r = " + roundForDisplay(calculatedR,2) + "</font>";
		}
		else{ //wrong, but not critical
			document.getElementById('result').innerHTML = "<font color='red'>r = " + roundForDisplay(calculatedR,2) + ". Want to try again?</font>";
		}

		drawChart2DWithLine()

	}
	else{
		document.getElementById('result').innerHTML = "You've already made a guess for this graph! Get a new plot to continue!";
	}

}

$( document ).ready(function() {

	(document.getElementById("checkAnswer")).onclick = checkMyAnswer;
	(document.getElementById("getNewPlot")).onclick = getANewGraph;
	(document.getElementById("resetHistory")).onclick = resetMyHistory;

    getANewGraph();
    drawChart2D();
		drawBottomGraphs();

});

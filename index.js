var PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d");
  var dpr = window.devicePixelRatio || 1;
  var bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

var canvas = createHiDPICanvas(640, 420);
var ctx = canvas.getContext("2d");
var font = "10px Arial";
var accountFont = "12px Arial";
var accountFontColor = "#eeeeee";
var gainFont = "bold 12px Arial";
var gainFontColor = "rgba(216, 155, 56,";
var backgroundColor = "#1e1e1e";
var gridColor = "#666666";
var lineColor = "#079900";
var buyColor = "#dd8d1c";
var sellColor = "#dd8d1c";
var closeColor = "#ef6147";

var priceList = [];
var positions = {type: null, price: null, shares: null}
var capital = 10000;
var priceHi = 245;
var priceLo = 243;
var price = 244;

var mapPriceToPixels = (price) => {
  return (((price - priceHi)/(priceLo - priceHi)) * 400) + 10
}

var x = 0;
var y = mapPriceToPixels(price);

var roundToHalf = (number) => {
  return Math.floor(number*2)/2
}

var frameTracker = () => {
  var frameCount = 0;
  var draw = (instructions) => {
    if (frameCount < instructions.length) {
      instructions[frameCount]();
      frameCount++
    } else {
      instructions.slice(-1)[0]()
    }
  }
  return draw;
}

var drawBoard = () => {
  var newList = priceList.slice()
  var yList = newList.map((obj) => {
    return {x: obj.x, price: mapPriceToPixels(obj.price)}
  });

  // draw grid lines
  var yTop = roundToHalf(priceHi);
  var yBot = roundToHalf(priceLo);
  var lines = Array.from(new Array((yTop - yBot + 1) * 2), (x,i) => ({y: mapPriceToPixels((0.5*i) + yBot), price: (0.5*i) + yBot}))

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.setLineDash([])
  ctx.font = font;
  ctx.fillStyle = gridColor;
  ctx.strokeStyle = gridColor;

  for (var i=0;i<lines.length;i++) {
    ctx.moveTo(0,lines[i].y);
    ctx.lineTo(640,lines[i].y);
    ctx.fillText(lines[i].price.toString(),610,lines[i].y-5);
  }
  ctx.stroke();
  ctx.closePath();

  // draw the green price line
  ctx.beginPath()
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([])
  ctx.moveTo(yList[0].x,yList[0].price)
  for (var i=1;i<yList.length;i++) {
    ctx.lineTo(yList[i].x,yList[i].price)
  }
  ctx.stroke();
  ctx.closePath();

  // draw account value
  ctx.beginPath();
  ctx.rect(5,5,200,30);
  ctx.setLineDash([]);
  ctx.lineWidth = 2;
  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = gridColor;
  ctx.stroke();
  ctx.fill();
  ctx.font = accountFont;
  ctx.fillStyle = accountFontColor;
  ctx.fillText("Current Account Value: " + capital.toFixed(2),16,24)
  ctx.closePath();
}

var startTradingDay = () => {
  var funArray = [];
  canvas.addEventListener('click', 
    () => {
      if (!positions.type) {
        buy(x,price,funArray)
      }
      else {
        close(x,price,funArray)
      }
    })
  var interval = setInterval(function(){stockMover(interval,funArray)},30);
}

var generateBuyInstructions = (x,price) => {
  return ([
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),8,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),7,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),6,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),5,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),4,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),3,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),3,0,2*Math.PI);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.font = font;
      ctx.setLineDash([5,5])
      ctx.moveTo(x,mapPriceToPixels(price));
      ctx.lineTo(((640-x)/4 + x), mapPriceToPixels(price))
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),3,0,2*Math.PI);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.font = font;
      ctx.setLineDash([5,5])
      ctx.moveTo(x,mapPriceToPixels(price));
      ctx.lineTo(((640-x)/2 + x), mapPriceToPixels(price))
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),3,0,2*Math.PI);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.font = font;
      ctx.setLineDash([5,5])
      ctx.moveTo(x,mapPriceToPixels(price));
      ctx.lineTo(((640-x)*3/4 + x), mapPriceToPixels(price))
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.fillStyle = buyColor;
      ctx.strokeStyle = buyColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),3,0,2*Math.PI);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.font = font;
      ctx.setLineDash([5,5])
      ctx.moveTo(x,mapPriceToPixels(price));
      ctx.lineTo(640, mapPriceToPixels(price))
      ctx.stroke();
      ctx.fillText(price.toFixed(2),607,mapPriceToPixels(price)-5)
      ctx.closePath();
    })
  ])
}

var generateCloseInstructions = (x,price,funArray) => {
  var gains = (positions.shares * price) - capital;
  return ([
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = closeColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),8,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = closeColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),7,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = closeColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),6,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = closeColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),5,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = closeColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),4,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = closeColor;
      ctx.setLineDash([])
      ctx.arc(x,mapPriceToPixels(price),3,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      funArray.shift();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "1.0)";
      ctx.fillText(gains.toFixed(2),x-10,mapPriceToPixels(price)-10);
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.9)";
      ctx.fillText(gains.toFixed(2),x-11,mapPriceToPixels(price)-11)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.8)";
      ctx.fillText(gains.toFixed(2),x-12,mapPriceToPixels(price)-12)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.7)";
      ctx.fillText(gains.toFixed(2),x-13,mapPriceToPixels(price)-13)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.6)";
      ctx.fillText(gains.toFixed(2),x-14,mapPriceToPixels(price)-14)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.5)";
      ctx.fillText(gains.toFixed(2),x-15,mapPriceToPixels(price)-15)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.4)";
      ctx.fillText(gains.toFixed(2),x-16,mapPriceToPixels(price)-16)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.3)";
      ctx.fillText(gains.toFixed(2),x-17,mapPriceToPixels(price)-17)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.2)";
      ctx.fillText(gains.toFixed(2),x-18,mapPriceToPixels(price)-18)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.1)";
      ctx.fillText(gains.toFixed(2),x-19,mapPriceToPixels(price)-19)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.font = gainFont;
      ctx.fillStyle = gainFontColor + "0.0)";
      ctx.fillText(gains.toFixed(2),x-20,mapPriceToPixels(price)-20)
      ctx.stroke();
      ctx.closePath();
    }),
    (() => {
      funArray.shift();
    })
  ])
}

var buy = (x,price,funArray) => {
  var instructions = generateBuyInstructions(x,price);
  var animate = frameTracker();
  positions.type = 'long';
  positions.price = price;
  positions.shares = capital/price;
  funArray.push(() => {animate(instructions)});
}

var close = (x,price,funArray) => {
  var instructions = generateCloseInstructions(x,price,funArray);
  var animate = frameTracker();
  capital = positions.shares * price;
  positions.type = null;
  positions.price = null;
  positions.shares = null;
  funArray.push(() => {animate(instructions)});
}

var stockMover = (interval,funArray) => {
  var dx = 2;

  if (x > 640) {
    endTradingDay(interval);
  }

  if (price > priceHi) {
    priceHi = price;
  }

  if (price < priceLo) {
    priceLo = price;
  }

  x += dx;
  price += ((Math.random() * 0.2)-0.1);
  
  priceList.push({x: x, price: price});
  drawBoard();

  for (var i=0;i<funArray.length;i++) {
    funArray[i]();
  }
}

var endTradingDay = (interval) => {
  clearInterval(interval);
  // TODO
}

startTradingDay();

document.getElementById("game").appendChild(canvas);
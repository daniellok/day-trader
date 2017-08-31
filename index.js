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
var font = "10px Arial"
var gridColor = "#666666";
var lineColor = "#079900";
var buyColor = "#dd8d1c";
var sellColor = "#dd8d1c";
var closeColor = "#ef6147";

var priceList = [];
var positions = {type: null, price: null}
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
      ctx.setLineDash([5,5])
      ctx.moveTo(x,mapPriceToPixels(price));
      ctx.lineTo(640, mapPriceToPixels(price))
      ctx.stroke();
      ctx.fillText(price.toFixed(2),607,mapPriceToPixels(price)-5)
      ctx.closePath();
    })
  ])
}

var generateCloseInstructions = (x,price) => {
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
    })
  ])
}

var buy = (x,price,funArray) => {
  var instructions = generateBuyInstructions(x,price);
  var animate = frameTracker();
  positions.type = 'long';
  positions.price = price;
  funArray.push(() => {animate(instructions)});
}

var close = (x,price,funArray) => {

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
  alert("Wow!")
}

startTradingDay();

document.getElementById("game").appendChild(canvas);
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

ctx.beginPath();
ctx.rect(0,0,640,420);
ctx.fillStyle = "#1e1e1e";
ctx.fill();
ctx.closePath();

var priceList = [];
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
  ctx.font = "12px Arial";
  ctx.fillStyle = "#666666";
  ctx.strokeStyle = "#666666";

  for (var i=0;i<lines.length;i++) {
    ctx.moveTo(0,lines[i].y);
    ctx.lineTo(640,lines[i].y);
    ctx.fillText(lines[i].price.toString(),605,lines[i].y-5);
  }
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath()
  ctx.strokeStyle = "#079900";
  ctx.moveTo(yList[0].x,yList[0].price)
  for (var i=1;i<yList.length;i++) {
    ctx.lineTo(yList[i].x,yList[i].price)
  }
  ctx.stroke();
  ctx.closePath();
}

var startTradingDay = () => {
  var interval = setInterval(function(){stockMover(interval)},30);
}

var stockMover = (interval) => {
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
}

var endTradingDay = (interval) => {
  clearInterval(interval);
  alert("Wow!")
}

startTradingDay();

document.getElementById("game").appendChild(canvas);
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

var canvas = createHiDPICanvas(750, 430);
var ctx = canvas.getContext("2d");
var font = "10px Arial";
var accountFont = "12px Arial";
var accountFontBold = "bold 12px Arial";
var accountFontColor = "#eeeeee";
var gainFont = "bold 12px Arial";
var gainFontColor = "rgba(216, 155, 56,";
var backgroundColor = "#1e1e1e";
var darkBackgroundColor = "#111111";
var gridColor = "#666666";
var lineColor = "#079900";
var buyColor = "#dd8d1c";
var sellColor = "#dd8d1c";
var closeColor = "#ef6147";

var volatility = 0.2;
var skew = 0.00;

var ichimoku = false;
var ichimokuFill = "rgba(137, 57, 229, 0.5)"
var tenkansenData = Array(18).fill(244);
var kijunsenData = Array(52).fill(244);
var senkouspanbData = Array(104).fill(244);
var spanAColor = "#e0d90f";
var spanBColor = "#0daee0";
var ichiPointsA = [];
var ichiPointsB = [];

var rsiActive = false;
var prevPrice = 244;
var gainData = Array(14).fill(0);
var lossData = Array(14).fill(0);
var rsiBoundColor = "#9e6c0f";
var rsiLineColor = "#a3a3a3";
var rsiLowerFill = "rgba(186,0,0,0.5)";
var rsiUpperFill = "rgba(0,124,8,0.5";
var rsiPoints = [];

var priceList = [];
var funArray = [];
var positions = {type: null, price: null, shares: 0}
var overnightPosition = false;
var capital = 10000;
var priceHi = 245;
var priceLo = 243;
var price = 244;
var closePrice = 244;
var openPrice = 244;
var accountOpenValue = 10000;
var mousePos = {x: 0, y: 0};
var x = 5;
var y = mapPriceToPixels(price);

function mapPriceToPixels(price) {
  return (((price - priceHi)/(priceLo - priceHi)) * 370) + 40
}

function mapRSIToPixels(rsi) {
  return (((rsi - 100)/-100) * 100) + 320
}

function roundToHalf(number) {
  return Math.floor(number*2)/2
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

function frameTracker() {
  var frameCount = 0;
  function draw(instructions) {
    if (frameCount < instructions.length) {
      instructions[frameCount]();
      frameCount++
    } else {
      instructions.slice(-1)[0]()
    }
  }
  return draw;
}

function drawCheckbox(checked,x,y) {
  if (checked) {
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.fillStyle = gridColor;
    ctx.strokeStyle = gridColor;
    ctx.font = font;
    ctx.rect(x,y,10,10);
    ctx.stroke();
    ctx.fillText("✓",x+1,y+9);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.fillStyle = gridColor;
    ctx.strokeStyle = gridColor;
    ctx.rect(x,y,10,10);
    ctx.stroke();
    ctx.closePath();
  }
}

function drawStudies() {
  ctx.beginPath();
  ctx.font = accountFontBold;
  ctx.fillStyle = accountFontColor;
  ctx.fillText("Studies",673,17);
  ctx.font = font;
  ctx.fillText("Ichimoku Cloud",665,34)
  ctx.fillText("RSI",665,49)
  ctx.closePath();
  drawCheckbox(ichimoku,650,25);
  drawCheckbox(rsiActive,650,40);
}

function drawIchimoku() {
  tenkansenData.shift();
  kijunsenData.shift();
  senkouspanbData.shift();
  tenkansenData.push(price);
  kijunsenData.push(price);
  senkouspanbData.push(price);

  var tenkansen = (Math.max(...tenkansenData) + Math.min(...tenkansenData))/2;
  var kijunsen = (Math.max(...kijunsenData) + Math.min(...kijunsenData))/2;
  var senkouspana = (tenkansen + kijunsen)/2;
  var senkouspanb = (Math.max(...senkouspanbData) + Math.min(...senkouspanbData))/2;

  ichiPointsA.push({x: x, price: senkouspana});
  ichiPointsB.push({x: x, price: senkouspanb});

  if (ichimoku) {
    // draw span a
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeStyle = spanAColor;
    ctx.moveTo(ichiPointsA[0].x,mapPriceToPixels(ichiPointsA[0].price))
    for (var i=0;i<ichiPointsA.length;i++) {
      ctx.lineTo(ichiPointsA[i].x,mapPriceToPixels(ichiPointsA[i].price))
    }
    ctx.stroke();
    ctx.closePath();

    // draw span b
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeStyle = spanBColor;
    ctx.moveTo(ichiPointsB[0].x,mapPriceToPixels(ichiPointsB[0].price))
    for (var i=0;i<ichiPointsB.length;i++) {
      ctx.lineTo(ichiPointsB[i].x,mapPriceToPixels(ichiPointsB[i].price))
    }
    ctx.stroke();
    ctx.closePath();

    // draw fill
    ctx.beginPath();
    ctx.moveTo(ichiPointsA[0].x,mapPriceToPixels(ichiPointsA[0].price))
    for (var i=0;i<ichiPointsB.length;i++) {
      ctx.lineTo(ichiPointsB[i].x,mapPriceToPixels(ichiPointsB[i].price))
    }
    ctx.lineTo(ichiPointsA[ichiPointsA.length - 1].x,mapPriceToPixels(ichiPointsA[ichiPointsA.length - 1].price))
    for (var i=0;i<ichiPointsA.length;i++) {
      ctx.lineTo(ichiPointsA[ichiPointsA.length - i - 1].x,mapPriceToPixels(ichiPointsA[ichiPointsA.length - i - 1].price))
    }
    ctx.save();
    ctx.clip();
    ctx.fillStyle = ichimokuFill;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.closePath();
    ctx.restore();
  }
}

function drawRSI() {
  var newData = price - prevPrice;
  prevPrice = price;
  lossData.shift();
  gainData.shift();
  if (newData >= 0) {
    lossData.push(0);
    gainData.push(newData);
  } else {
    lossData.push(-newData);
    gainData.push(0);
  }

  var avgGain = (gainData.reduce((a,b) => {return a + b}))/gainData.length;
  var avgLoss = (lossData.reduce((a,b) => {return a + b}))/lossData.length;
  if (avgLoss == 0) {
    avgLoss = 0.1
  }
  var rs = avgGain/avgLoss;
  var rsi = 100 - (100/(1+rs));

  rsiPoints.push({x: x, rsi: rsi});

  if (rsiActive) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeStyle = rsiBoundColor;
    ctx.moveTo(5,350);
    ctx.lineTo(640,350);
    ctx.moveTo(5,390);
    ctx.lineTo(640,390);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = rsiLineColor;
    ctx.moveTo(rsiPoints[0].x,mapRSIToPixels(rsiPoints[0].rsi));
    for (var i=1;i<rsiPoints.length;i++) {
      ctx.lineTo(rsiPoints[i].x,mapRSIToPixels(rsiPoints[i].rsi));
    }
    ctx.stroke();
    ctx.closePath();

    // fill upper rsi bound
    ctx.beginPath();
    ctx.moveTo(5,350);
    for (var i=0;i<rsiPoints.length;i++) {
      ctx.lineTo(rsiPoints[i].x,mapRSIToPixels(rsiPoints[i].rsi));
    }
    ctx.lineTo(rsiPoints[rsiPoints.length - 1].x,350);
    ctx.lineTo(5,350);
    ctx.save();
    ctx.clip();
    ctx.fillStyle = rsiUpperFill;
    ctx.fillRect(5,320,640,30);
    ctx.closePath();
    ctx.restore();

    // fill lower rsi bound
    ctx.beginPath();
    ctx.moveTo(5,390);
    for (var i=0;i<rsiPoints.length;i++) {
      ctx.lineTo(rsiPoints[i].x,mapRSIToPixels(rsiPoints[i].rsi));
    }
    ctx.lineTo(rsiPoints[rsiPoints.length - 1].x,390);
    ctx.lineTo(5,390);
    ctx.save();
    ctx.clip();
    ctx.fillStyle = rsiLowerFill;
    ctx.fillRect(5,390,640,30);
    ctx.closePath();
    ctx.restore();
  }
}

function drawBoard() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // draw background
  ctx.beginPath();
  ctx.fillStyle = darkBackgroundColor;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(5,5,635,420);
  ctx.closePath();

  // draw grid lines
  var yTop = roundToHalf(priceHi);
  var yBot = roundToHalf(priceLo);
  var lines = Array.from(new Array((yTop - yBot + 1) * 2), (x,i) => ({y: mapPriceToPixels((0.5*i) + yBot), price: (0.5*i) + yBot}))

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.font = font;
  ctx.fillStyle = gridColor;
  ctx.strokeStyle = gridColor;
  for (var i=0;i<lines.length;i++) {
    ctx.moveTo(5,lines[i].y);
    ctx.lineTo(640,lines[i].y);
    ctx.fillText(lines[i].price.toString(),611,lines[i].y-5);
  }
  ctx.stroke();
  ctx.closePath();

  // draw the green price line
  var newList = priceList.slice()
  var yList = newList.map((obj) => {
    return {x: obj.x, price: mapPriceToPixels(obj.price)}
  });
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
  ctx.font = accountFont;
  ctx.fillStyle = accountFontColor;
  ctx.fillText("Net Liquidating Value: " + (positions.shares * price + capital).toFixed(2),20,29)
  ctx.fillText("Cash Available: " + capital.toFixed(2),54,44)
  ctx.fillText("Shares Held: " + positions.shares,68,59)
  ctx.closePath();

  // draw border
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.strokeStyle = gridColor;
  ctx.rect(5,5,636,420);
  ctx.stroke();
  ctx.closePath();
}

function drawButton(fillColor) {
  ctx.beginPath();
  ctx.rect(280,260,90,35);
  ctx.fillStyle = fillColor;
  ctx.stroke();
  ctx.fill();
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = accountFontColor;
  ctx.fillText("Next Day", 290,283);
}

function dayOnClick() {
  if (mousePos.x > 5 && mousePos.x < 641 && mousePos.y > 5 && mousePos.y < 425) {
    if (!positions.type) {
      buy(x,price)
    }
    else {
      close(x,price)
    }
  } else if (mousePos.x > 650 && mousePos.x < 735 && mousePos.y > 26 && mousePos.y < 38) {
      ichimoku = !ichimoku;
  } else if (mousePos.x > 650 && mousePos.x < 735 && mousePos.y > 38 && mousePos.y < 50) {
      rsiActive = !rsiActive;
  }
}

function onMouseMoveDay(e) {
  mousePos = getMousePos(canvas, e)
}

function buttonOnClick() {
  if (mousePos.x > 280 && mousePos.x < 370 && mousePos.y > 260 && mousePos.y < 295) {
      startTradingDay();
  }
}

function onMouseMoveNight(e) {
  mousePos = getMousePos(canvas, e)
  if (mousePos.x > 280 && mousePos.x < 370 && mousePos.y > 260 && mousePos.y < 295) {
    canvas.style.cursor = "pointer";
    drawButton("#333333");
  } else {
    canvas.style.cursor = "default";
    drawButton(backgroundColor);
  }
}

function startTradingDay() {
  openPrice = closePrice;
  priceHi = openPrice + 1;
  priceLo = openPrice - 1;
  accountOpenValue = (positions.shares * price + capital);
  canvas.removeEventListener('mousemove',onMouseMoveNight);
  canvas.removeEventListener('click',buttonOnClick);

  canvas.addEventListener('mousemove',onMouseMoveDay);
  canvas.addEventListener('click', dayOnClick);

  var interval = setInterval(function(){stockMover(interval)},30);
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

var generateCloseInstructions = (x,price) => {
  var gains = ((positions.shares * price) - (positions.shares * positions.price));
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
      funArray.shift()
    })
  ])
}

function buy(x,price) {
  var instructions = generateBuyInstructions(x,price);
  var animate = frameTracker();
  positions.type = 'long';
  positions.price = price;
  positions.shares = Math.floor(capital/price);
  capital = capital - (positions.shares * price)
  funArray.push(() => {animate(instructions)});
}

function close(x,price) {
  var instructions = generateCloseInstructions(x,price);
  var animate = frameTracker();
  capital = capital + (positions.shares * price);
  positions.type = null;
  positions.price = null;
  positions.shares = 0;
  overnightPosition = false;
  funArray.push(() => {animate(instructions)});
}

function drawOvernightPosition() {
  if (positions.price > priceLo && positions.price < priceHi) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = buyColor;
    ctx.fillStyle = buyColor;
    ctx.font = font;
    ctx.setLineDash([5,5])
    ctx.moveTo(0,mapPriceToPixels(positions.price));
    ctx.lineTo(640, mapPriceToPixels(positions.price))
    ctx.stroke();
    ctx.fillText(positions.price.toFixed(2),604,mapPriceToPixels(positions.price)-5)
    ctx.closePath();
  } else if (positions.price > priceHi) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = buyColor;
    ctx.font = font;
    ctx.fillText("^",617,15)
    ctx.fillText(positions.price.toFixed(2),604,22)
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = buyColor;
    ctx.font = font;
    ctx.fillText("v",617,414)
    ctx.fillText(positions.price.toFixed(2),604,405)
    ctx.closePath();
  }
}

function drawEndDayText() {
  var indexGain = ((closePrice-openPrice)/openPrice)*100;
  var accountGain = (((positions.shares * price + capital)-accountOpenValue)/accountOpenValue)*100;
  var indexYTD = ((closePrice-244)/244)*100;
  var accountYTD = (((positions.shares * price + capital)-10000)/10000)*100;

  ctx.beginPath();
  ctx.font = "bold 20px Arial";
  ctx.fillStyle = accountFontColor;
  ctx.fillText("DING DING DING!",235,140)
  ctx.fillStyle = gridColor;
  ctx.font = accountFontBold;
  ctx.fillText("SPY Close: ",205,167);
  ctx.fillText("Account Value: ", 205, 185);
  ctx.fillText("SPY YTD Gains: ", 205, 215);
  ctx.fillText("Account YTD Gains: ", 205, 232)

  if (indexGain > 0) {
    ctx.fillStyle = lineColor;
    ctx.fillText(closePrice.toFixed(2) + " (" + indexGain.toFixed(2) + "%)",272,167)
  } else if (indexGain == 0) {
    ctx.fillStyle = accountFontColor;
    ctx.fillText(closePrice.toFixed(2) + " (" + indexGain.toFixed(2) + "%)",272,167)
  } else if (indexGain < 0) {
    ctx.fillStyle = closeColor;
    ctx.fillText(closePrice.toFixed(2) + " (" + indexGain.toFixed(2) + "%)",272,167)
  }

  if (accountGain > 0) {
    ctx.fillStyle = lineColor;
    ctx.fillText((positions.shares * price + capital).toFixed(2) + " (" + accountGain.toFixed(2) + "%)",294,185);
  } else if (accountGain == 0) {
    ctx.fillStyle = accountFontColor;
    ctx.fillText((positions.shares * price + capital).toFixed(2) + " (" + accountGain.toFixed(2) + "%)",294,185);
  } else if (accountGain < 0) {
    ctx.fillStyle = closeColor;
    ctx.fillText((positions.shares * price + capital).toFixed(2) + " (" + accountGain.toFixed(2) + "%)",294,185);
  }

  if (indexYTD > 0) {
    ctx.fillStyle = lineColor;
    ctx.fillText(indexYTD.toFixed(2) + "%",299,215)
  } else if (indexYTD == 0) {
    ctx.fillStyle = accountFontColor;
    ctx.fillText(indexYTD.toFixed(2) + "%",299,215)
  } else if (indexYTD < 0) {
    ctx.fillStyle = closeColor;
    ctx.fillText(indexYTD.toFixed(2) + "%",299,215)
  }

  if (accountYTD > 0) {
    ctx.fillStyle = lineColor;
    ctx.fillText(accountYTD.toFixed(2) + "%",323,232);
  } else if (accountYTD == 0) {
    ctx.fillStyle = accountFontColor;
    ctx.fillText(accountYTD.toFixed(2) + "%",323,232);
  } else if (accountYTD < 0) {
    ctx.fillStyle = closeColor;
    ctx.fillText(accountYTD.toFixed(2) + "%",323,232);
  }
  ctx.closePath();
}

function stockMover(interval) {
  var dx = 2;

  if (price > priceHi) {
    priceHi = price;
  }

  if (price < priceLo) {
    priceLo = price;
  }

  x += dx;
  price += (((Math.random() * volatility) - (volatility/2)) + skew);
  
  priceList.push({x: x, price: price});

  // draw board
  drawBoard();

  // draw studies panel
  drawStudies();

  if (overnightPosition) {
    drawOvernightPosition();
  }

  drawIchimoku();
  drawRSI();

  for (var i=0;i<funArray.length;i++) {
    funArray[i]();
  }

  if (x > 640) {
    endTradingDay(interval);
  }
}

function endTradingDay(interval) {
  clearInterval(interval);
  x = 5;
  y = mapPriceToPixels(price);
  closePrice = price;
  priceList = [];
  funArray = [];
  ichiPointsA = [];
  ichiPointsB = [];
  rsiPoints = []
  if (positions.type) {
    overnightPosition = true;
    funArray = [() => {}]
  } else {
    overnightPosition = false;
  }

  canvas.removeEventListener('mousemove', onMouseMoveDay);
  canvas.removeEventListener('click', dayOnClick);

  // poll for the mousex and mousey
  canvas.addEventListener('mousemove', onMouseMoveNight);
  canvas.addEventListener('click', buttonOnClick)

  // draw the stuff
  ctx.beginPath();
  ctx.rect(170,105,300,200);
  ctx.setLineDash([]);
  ctx.lineWidth = 2;
  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = gridColor;
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  drawEndDayText();
  drawButton(backgroundColor);
}

startTradingDay();

document.getElementById("game").appendChild(canvas);
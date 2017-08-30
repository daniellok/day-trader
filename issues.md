## Implementing Dynamic Scaling

- drawGrid(priceClose,priceHi,priceLo)
  - at the start of each day, call this once with priceHigh = priceClose + 2, priceLow = priceClose - 2
  - update priceHigh/Low if the price during the day gets within a certain range
  - Map price to y value
    - priceClose should always map to 210 (half of y)
  - priceInterval (the space between the lines) should always be 0.5, so when we scale out we just add lines.




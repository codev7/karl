UI.registerHelper('timeFormat', function(time) {
  var timeFormatted = moment(time).format("hh:mm A");
  return timeFormatted;
});

UI.registerHelper('secondsToMinutes', function(secs) {
  return secs/60;

});

getDaysOfWeek = function(date) {
  var monday = moment(date).weekday(0).format("YYYY-MM-DD"); // Monday
  var sunday = moment(date).weekday(6).format("YYYY-MM-DD"); // Friday
  return {
    "day1": monday,
    "day7": sunday 
  };
}

getDaysOfWholeWeek = function(date) {
  var doc = [
    {
      "date": moment(date).weekday(0).format("YYYY-MM-DD"), // Sunday
      "day": "Sunday",
      "fMnD": moment(date).weekday(0).format("MM-DD") // Sunday
    },
    {
      "date": moment(date).weekday(1).format("YYYY-MM-DD"), // Monday
      "day": "Monday",
      "fMnD": moment(date).weekday(1).format("MM-DD"), // Monday
    },
    {
      "date": moment(date).weekday(2).format("YYYY-MM-DD"), // Tuesday
      "day": "Tuesday",
      "fMnD": moment(date).weekday(2).format("MM-DD"), // Tuesday
    },
    {
      "date": moment(date).weekday(3).format("YYYY-MM-DD"), // Wednesday
      "day": "Wednesday",
      "fMnD": moment(date).weekday(3).format("MM-DD"), // Wednesday
    },
    {
      "date": moment(date).weekday(4).format("YYYY-MM-DD"), // Thursday
      "day": "Thursday",
      "fMnD": moment(date).weekday(4).format("MM-DD"), // Thursday
    },
    {
      "date": moment(date).weekday(5).format("YYYY-MM-DD"), // Friday
      "day": "Friday",
      "fMnD": moment(date).weekday(5).format("MM-DD"), // Friday
    },
    {
      "date": moment(date).weekday(6).format("YYYY-MM-DD"), // Saturday
      "day": "Saturday",
      "fMnD": moment(date).weekday(6).format("MM-DD"), // Saturday
    }
  ];
  return doc;
}

getDaysOfMonth = function(date) {
  var month_startDate = moment(date).startOf('month').format("YYYY-MM-DD");
  var month_endDate = moment(date).endOf('month').format("YYYY-MM-DD");
  return {"start": month_startDate, "end": month_endDate};
}

getPrepItem = function(id) {
  if(id) {
    var jobItem = JobItems.findOne(id);
    if(jobItem) {
      jobItem.totalPrepCost = 0;
      jobItem.prepCostPerPortion = 0;
      if(jobItem.ingredients.length > 0) {
        jobItem.ingredients.forEach(function(ing) {
          var ingCost = 0;
          var ingItem = Ingredients.findOne(ing.id);
          if(ingItem) {
            if(ing.unit == "each") {
              ingCost = parseFloat(ingItem.costPerUnit)/parseInt(ingItem.unitSize);
            } else {
              var unitId = ingItem.unit + "-" + ingItem.portionUsed;
              var conversion = Conversions.findOne(unitId);
              if(conversion) {
                var convertedCount = parseInt(conversion.count);
                if(ingItem.unitSize > 1) {
                  convertedCount = (convertedCount * parseInt(ingItem.unitSize));
                }
                ingCost = parseFloat(ingItem.costPerUnit)/convertedCount;
              } else {
                ingCost = 0;
                console.log("Convertion not defined", ingItem);
              }
            }
          }
          var calc_cost = ingCost * ing.quantity;
          jobItem.totalPrepCost += calc_cost;
        });
      }
      // console.log("........helper", jobItem);
      jobItem.prepCostPerPortion = parseFloat(jobItem.totalPrepCost/jobItem.portions)
      return jobItem;
    }
  }
}

getIngredientItem = function(id) {
  if(id) {
    var item = Ingredients.findOne();
    if(item) {
      item.costPerPortion = 0;
      if(item.unit == "each") {
        costPerPortion = parseFloat(item.costPerUnit)/parseInt(item.unitSize)
      } else {
        var unitId = item.unit + "-" + item.portionUsed;
        if(unitId) {
          var conversion = Conversions.findOne(unitId);
          if(conversion) {
            var convertedCount = parseInt(conversion.count);
            if(this.unitSize > 1) {
              convertedCount = (convertedCount * parseInt(this.unitSize));
            }
            item.costPerPortion = parseFloat(item.costPerUnit)/convertedCount;
          } else {
            item.costPerPortion = 0;
            console.log("Convertion not defined");
          }
        }
      }
      item.costPerPortion = Math.round(item.costPerPortion * 100)/100;
      return item;
    }
  }
}
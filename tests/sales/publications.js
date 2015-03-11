var server = meteor({flavor: "fiber"});
var client = ddp(server, {flavor: "fiber"});

describe("Testing sales publications", function() {
  describe("weeklySales publication", function() {
    it("checking values", function() {
      var sales = server.execute(function() {
        var ids = [];
        for(var i=10; i<15; i++) {
          var date = "2015-01-" + i
          var id = Sales.insert({"date": date, "sales": "$1000"});
          ids.push(id);
        }
        return ids;
      });
      expect(sales.length).to.be.equal(5);
      client.subscribe("weeklySales", ["2015-01-10", "2015-01-20"]);

      var data = client.collection('sales');
      expect(Object.keys(data).length).to.be.equal(5);
    });
  });
});
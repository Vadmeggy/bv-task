package computerdatabase

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import scala.util.Random

class EbaySimulation extends Simulation {
  val httpProtocol = http
    .baseUrl("https://www.ebay.com")
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
    .acceptLanguageHeader("en;q=1.0,de-AT;q=0.9")
    .acceptEncodingHeader("gzip;q=1.0,compress;q=0.5")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36")


  val item: List[String] = List("Sony", "Panasonic", "Playstation 4", "Blizzard",
    "Apple", "iPhone", "Samsung", "MacBook", "intel core i7", "seagate")

  val random = new Random

  val scn = scenario("Simple Get Request")
    .exec(http("Get Home page")
      .get("/")
      .check(responseTimeInMillis.lt(1000)))
    .pause(2)
    .exec(http("Search for items")
      .get(f"/sch/i.html?_nkw=${item(random.nextInt(item.length))}")
      .check(css(".srp-results .s-item").count.gt(5))
      .check(responseTimeInMillis.lt(1000))
    )


  setUp(scn.inject(atOnceUsers(10)).protocols(httpProtocol))
}



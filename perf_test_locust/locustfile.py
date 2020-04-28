import datetime
import random

from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from locust import HttpLocust, constant, TaskSet, task

ITEMS_TO_QUERY = ["Sony", "Panasonic", "Playstation 4", "Blizzard",
                  "Apple", "iPhone", "Samsung", "MacBook", "intel core i7", "seagate"]
TIMEOUT = 1

ua_str = UserAgent().chrome


class UserBehaviour(TaskSet):
    @task
    def index(self):
        with self.client.get("/", headers={"User-Agent": ua_str},
                             catch_response=True) as response:
            if response.elapsed > datetime.timedelta(seconds=TIMEOUT):
                response.failure("Response took longer than 1 second")

    @task
    def search(self):
        item_to_query = random.choice(ITEMS_TO_QUERY)
        with self.client.get(f"/sch/i.html?_nkw={item_to_query}", headers={"User-Agent": ua_str},
                             catch_response=True) as response:
            soup = BeautifulSoup(response.content, 'html.parser')
            result = soup.select('.srp-results .s-item')
            if response.elapsed > datetime.timedelta(seconds=TIMEOUT):
                print(response.elapsed)
                response.failure(f"Response took longer than {TIMEOUT} second")
            if len(result) <= 5:
                response.failure("Not enough items found")


class WebsiteUser(HttpLocust):
    host = 'https://www.ebay.com'
    task_set = UserBehaviour
    wait_time = constant(2)

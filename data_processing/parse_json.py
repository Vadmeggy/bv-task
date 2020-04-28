import datetime
import json

with open('data.json', 'r') as f:
    data = json.load(f)

what_to_print = ['Corners', 'Fouls', 'GoalKicks', 'ThrowIns', 'Goals']
for item in what_to_print:
    print(f"{item}: {data[item]['Score']}")
data['FixtureId'] = 1000
data['CustomerId'] = 1

first_half = datetime.datetime.strptime(data['StartTimes']['FirstHalf'], '%Y-%m-%dT%H:%M:%S.%fZ')
first_half = first_half - datetime.timedelta(hours=1, minutes=30)
data['StartTimes']['FirstHalf'] = first_half.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

second_half = datetime.datetime.strptime(data['StartTimes']['SecondHalf'], '%Y-%m-%dT%H:%M:%S.%fZ')
second_half = second_half - datetime.timedelta(minutes=30)
data['StartTimes']['SecondHalf'] = second_half.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

from pprint import pprint

pprint(data)

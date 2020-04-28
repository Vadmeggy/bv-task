import random
import string

from lxml import etree

parsed = etree.parse('data.xml')

bet_description = parsed.find('.//betDescription')
sportsbook_reference = parsed.find('.//sportsBookReference')
transaction_id = parsed.find('.//transactionId')
outcome_id = parsed.find('.//outcomeId')
total_stake = parsed.find('.//totalStake')

print(f'sportsBookReference: {sportsbook_reference.text}')
print(f'transactionId: {transaction_id.text}')
print(f'outcomeId: {outcome_id.text}')
print(f'totalStake: {total_stake.text}')

random_string = ''.join([random.choice(string.ascii_letters) for _ in range(100)])
bet_description.text = random_string
total_stake.text = '10'
transaction_id.text = '1'
print(etree.tostring(parsed, pretty_print=True).decode())

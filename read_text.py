import subprocess as sp
from random import randint as ri

f = open('tweets.txt', 'r')
tweets = f.readlines()
number_of_lines = len(tweets)
random_tweet = ri(0, number_of_lines)
tweeeet = tweets[random_tweet]

sp.check_output(['say -v Alex ' + tweeeet], shell=True)


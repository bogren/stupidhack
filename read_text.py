import subprocess as sp
from random import randint as ri
import time

f = open('tweets.txt', 'r')
t = open('tmp.txt', 'w')
tweets = f.readlines()
number_of_lines = len(tweets)
random_tweet = ri(0, number_of_lines)
tweeeet = tweets[random_tweet]
t.write(tweeeet)
t.close()
sp.check_output(['cat tmp.txt | say'], shell=True)


# Thanks Jason Kotchoff!
# Code from https://gist.github.com/jkotchoff/03add042c9b1b7db350c
#
# Generate and use an oauth2 bearer token for the Twitter API in Ruby
#
# For Application-Only authentication to the twitter API, a 'bearer token'
# is required to authenticate agains their endpoints for rate limiting
# purposes.
#
# This script generates a bearer token by posting to twitter and then it
# uses that token to poll their API.
#
# Note, the base 64 encoded consumer credentials for the bearer token needs
# to be stripped of newlines in order for this to work.
#
# The <consumer_key> and <consumer_secret> can be found by administering
# a twitter app at:
# http://apps.twitter.com
#
# For documentation on how to generate this bearer token, refer:
# https://dev.twitter.com/oauth/reference/post/oauth2/token

require 'rubygems'
require 'base64'
require 'httparty'
require 'json'

consumer_key = ""
consumer_secret = ""

credentials = Base64.encode64("#{consumer_key}:#{consumer_secret}").gsub("\n", '')
url = "https://api.twitter.com/oauth2/token"
body = "grant_type=client_credentials"
headers = {
  "Authorization" => "Basic #{credentials}",
  "Content-Type" => "application/x-www-form-urlencoded;charset=UTF-8"
}
r = HTTParty.post(url, body: body, headers: headers)
bearer_token = JSON.parse(r.body)['access_token']
puts "Twitter bearer token is: #{bearer_token}"

api_auth_header = {"Authorization" => "Bearer #{bearer_token}"}
url = "https://api.twitter.com/1.1/search/tweets.json?q=nba"
puts HTTParty.get(url, headers: api_auth_header).body
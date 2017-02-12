var Twitter = require('twitter')
var fs = require('fs')
var say = require('say')

const tweet_file = "tweets.txt"

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
})

var params = {screen_name: 'realDonaldTrump', count: '101'}
client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        for (var i in tweets) {
            fs.appendFile(tweet_file, replace_word(tweets[i].text.toLowerCase()) + '\n', function(error) {})
        }
    } else {
        console.log(error)
    }
})

// Word Replacement

function replace_word(string) {
    string = replace_links(string)
    string = replace_mentions(string)
    string = append_haha(string)
    string = replace_amp(string)
    return string
}

function replace_links(string) {
    return string.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
}

function replace_mentions(string) {
    return string.replace(/@([a-z\d_]+)/ig, 'unicorn')
}

function replace_amp(string) {
    return string.replace(/(?:&amp;)/ig, 'and')
}

function append_haha(string) {
    var haha = ' wall wall wall wall wall wall wall'
    var search = 'wall'
    console.log(string.indexOf(search))
    var end_index = string.indexOf(search) + search.length
    if (end_index === -1 || end_index === search.length - 1) {
        return string
    }

    return [string.slice(0, end_index), haha, string.slice(end_index)].join('');
}
from flask import Flask
app = Flask(__name__)

import subprocess

@app.route('/')
def read():
   subprocess.check_output(['festival --tts test.txt'], shell=True)
   return 'Success!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
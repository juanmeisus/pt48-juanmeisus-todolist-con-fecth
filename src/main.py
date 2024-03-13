from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "mer webo"

app.run(port=5000)
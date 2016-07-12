from flask import Flask, render_template, g, redirect,abort, request, Blueprint
from OpenSSL import SSL
from config import *
from flask_cors import cross_origin
from couch import Couch
import json

from api.login.login import login

app = Flask(__name__, static_folder='', static_url_path='')

app.secret_key = "opensdn"

app.register_blueprint(login)

def connect_db():
	"""Returns a new connection to the database."""
	server = couchdbkit.Server()
	return server.get_or_create_db(database)

@app.route('/')
def show_home():
	return redirect("index.html", code=302)

@app.before_request
def db_connect():
	try:
		g.db = connect_db()
		Entry.set_db(g.db)
		print g.db
	except Exception as e:
		print e
		print "error"

if __name__ == '__main__':
	app.run(debug=True)
	#app.run(host='0.0.0.0', port=5000, deb
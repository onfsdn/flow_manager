from flask import Blueprint, g, request, session
from flask_cors import cross_origin
import os
import sys
import re
import operator
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import *

### Python librarires
import json
from datetime import datetime, timedelta
from bson import json_util
from uuid import uuid4
from pprint import pprint
import math
from decimal import Decimal
import logging
from couch import Couch

### End points

@login.route('/login', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def login1():
	try:
		output = {}
		if request.method == 'POST':
			username = request.form['username']
			password = request.form['password']
			print username
			print password
			"""
			sql_login = "select * from "+gsc_dashboard_user+" where email='"+username+"' and password='"+password+"'"
			print sql_login
			data = g.conn.select_advanced(sql_login);
			if(len(data)==0):
				output['status'] = "1"
			else:
				session['uid'] = str(uuid4())
			session['username'] = username
			session['logged_in'] = data[0][1]+" "+data[0][2]
			output['uid'] = session['uid']
			output['fname'] = data[0][1]
			output['lname'] = data[0][2]
			output['status'] = "0"
			"""
	except Exception as e:
		print "Demo Tested"
		print e
		print "error"
	return json.dumps(output)

@login.route('/check_session_data', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def check_session_data():
	try:
		if(session['uid']!=""):
			status = 0
		else:
			status = 1
	except KeyError:
		status = 1
	return str(status)

@login.route('/logout', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def logout():
	session['username'] = None
	session.clear()
	output = {}
	output['result'] = 'success'
	return json.dumps(output)
from flask import Flask, render_template, g, redirect, abort, request, Blueprint
from flask import Blueprint, g, request, session
from OpenSSL import SSL
from config import *
from flask_cors import cross_origin
#from couch import Couch
import json
from uuid import uuid4
import requests


app = Flask(__name__, static_folder='', static_url_path='')

app.secret_key = "opensdn"


@app.route('/')
def show_home():
	return redirect("index.html", code=302)


def connect_db():
	try:
		pass
		#server = couchdbkit.Server()
		#return server.get_or_create_db("sdnhackfest")
	except Exception as e:
		print e
		print "error"

@app.before_request
def db_connect():
	try:
		pass
		#g.db = connect_db()
		#Entry.set_db(g.db)
		#print g.db
	except Exception as e:
		print e
		print "error"

@app.route('/auth', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def auth():
	output = {}
	username = ''
	password = ''
	result = 0
	if request.method == 'POST':
		username = request.form['username']
		password = request.form['password']
		login_url = rest_url + "user/user"
		test = requests.get(login_url)
		user_data =  json.loads(test.text)
		if(user_data['username']==username and user_data['password']==password):
			session['uid'] = str(uuid4())
			session['username'] = username
			session['logged_in'] = username
			output['logged_in'] = username
			output['username'] = username
			output['status'] = "0"
		else:
			output['status'] = "1"
	return json.dumps(output)


@app.route('/get_switch_info', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def get_switch_info():
	output = {}
	tmp_list = []
	flows_url = "http://172.16.0.6:5984/switches/_design/switches/_view/switch"
	r = requests.get(flows_url)
	flow_info =  json.loads(r.text)
	return json.dumps(flow_info)

@app.route('/get_all_flows', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def get_all_flows():
	output = {}
	tmp_list = []
	flows_url = "http://172.16.0.6:5984/flows/_design/flows/_view/flows"
	r = requests.get(flows_url)
	flow_info =  json.loads(r.text)
	return json.dumps(flow_info)

@app.route('/get_flow_info', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def get_flow_info():
	if request.method == 'POST':
		json_data = request.get_json()
		flow_id = json_data.get("flow_id", "")
		url = "http://172.16.0.6:5984/flows/"+flow_id
		print url
		r = requests.get(url)
		info = json.loads(r.text)
		return json.dumps(info)

@app.route('/getdocs', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def loaddata():
	data = {}
	if request.method == 'POST':
		docs_id = request.form['docs_id']
		test = requests.get('http://localhost:5984/sdnhackfest/'+docs_id)
		user_data =  json.loads(test.text)
	data ={
    "Date/Time": " Sat Dec 13 05:02:46 GMT 2014 (UTC)",
    "License Name": "6 AP Management",
    "Max APs": "6",
    "Max clients": "1250",
    "Model": "ZD1200",
    "SN": "171406000197",
    "Uptime": "11 days,  8:31",
    "Version": "9.8.0.0 BUILD=13995171",
    "children": [
        {
            "AP Reboot": "2",
            "APIP": "192.168.0.30",
            "APMAC": "58:93:96:1e:85:a0",
            "HW/SW Version": "14.0.0.0 / 9.8.0.0.329",
            "Mesh Role": "Undefined",
            "Model/Serial Num": "zf7363 / 921204002145",
            "Name": "RuckusAP",
            "PSK": "6/m*BV$LDZZw-z!HV5AiL7XfT3dq9^JR",
            "State": "RUN",
            "Timer": "HeartBeat, expires in 23 secs",
            "Tunnel/Sec Mode": "L3 (Unknown) / PSK",
            "ZoneDir found by": "Last ZoneDir Joined",
            "children": [],
            "fragment MTU": "1500",
            "mac": "58:93:96:1e:85:a0",
            "offset": "fc00::1",
            "reboot details": "apmgr, Update AP's Firmware completely",
            "reboot reason": "application reboot",
            "retry fail count": "0",
            "rx fragment count": "0",
            "rx message count": "268",
            "rx packet count": "268",
            "status": "connected",
            "tx fragment count": "6",
            "tx message count": "51",
            "tx packet count": "55",
            "type": "AP"
        },
        {
            "AP Reboot": "2",
            "APIP": "192.168.0.30",
            "APMAC": "58:93:96:1e:85:a0",
            "HW/SW Version": "14.0.0.0 / 9.8.0.0.329",
            "Mesh Role": "Undefined",
            "Model/Serial Num": "zf7363 / 921204002145",
            "Name": "RuckusAP",
            "PSK": "6/m*BV$LDZZw-z!HV5AiL7XfT3dq9^JR",
            "State": "RUN",
            "Timer": "HeartBeat, expires in 23 secs",
            "Tunnel/Sec Mode": "L3 (Unknown) / PSK",
            "ZoneDir found by": "Last ZoneDir Joined",
            "children": [],
            "fragment MTU": "1500",
            "mac": "58:93:96:1e:85:a0",
            "offset": "fc00::1",
            "reboot details": "apmgr, Update AP's Firmware completely",
            "reboot reason": "application reboot",
            "retry fail count": "0",
            "rx fragment count": "0",
            "rx message count": "268",
            "rx packet count": "268",
            "status": "connected",
            "tx fragment count": "6",
            "tx message count": "51",
            "tx packet count": "55",
            "type": "AP"
        },
        {
            "AP Reboot": "2",
            "APIP": "192.168.0.30",
            "APMAC": "58:93:96:1e:85:a0",
            "HW/SW Version": "14.0.0.0 / 9.8.0.0.329",
            "Mesh Role": "Undefined",
            "Model/Serial Num": "zf7363 / 921204002145",
            "Name": "RuckusAP",
            "PSK": "6/m*BV$LDZZw-z!HV5AiL7XfT3dq9^JR",
            "State": "RUN",
            "Timer": "HeartBeat, expires in 23 secs",
            "Tunnel/Sec Mode": "L3 (Unknown) / PSK",
            "ZoneDir found by": "Last ZoneDir Joined",
            "children": [],
            "fragment MTU": "1500",
            "mac": "58:93:96:1e:85:a0",
            "offset": "fc00::1",
            "reboot details": "apmgr, Update AP's Firmware completely",
            "reboot reason": "application reboot",
            "retry fail count": "0",
            "rx fragment count": "0",
            "rx message count": "268",
            "rx packet count": "268",
            "status": "connected",
            "tx fragment count": "6",
            "tx message count": "51",
            "tx packet count": "55",
            "type": "AP"
        }
    ],
    "type": "Zone Director"
}
	return json.dumps(data)

@app.route('/check_session_data', methods=['GET', 'POST', 'OPTIONS'])
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

@app.route('/logout', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def logout():
	session['username'] = None
	session.clear()
	output = {}
	output['result'] = 'success'
	return json.dumps(output)

if __name__ == '__main__':
	app.run(debug=True,host="0.0.0.0")

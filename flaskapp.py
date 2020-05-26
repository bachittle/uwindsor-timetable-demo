from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

"""
@app.route('/id/<id>')
def get_name(id):
    return "id: {0}".format(id)
"""

# template routes
@app.route('/')
def index():
    if 'q' in request.args:
        print(request.args['q'])
    return render_template('index.html')

@app.route('/timetable')
def timetable_template():
    if request.referrer:
        size = request.args['size']
        return render_template('timetable-'+size+'.html')
    else:
        return render_template('index.html')

@app.route('/search')
def search_template():
    if request.referrer:
        return render_template('search.html')
    else:
        return render_template('index.html')


# data routes
@app.route('/load_search_data', methods=["GET"])
def load_search_data():
    date = request.args['date']
    request_type = request.args['type']
    if date and request_type:
        fp = open("data/" + date + "_min.json", "r")
        json_data = json.load(fp)
        fp.close()
        new_list = []
        for key in json_data.keys():
            new_list.append(json_data[key])
            new_list[-1]["code"] = key
            if request_type == "profs":
                new_list[-1]["profs"] = []
                for section in json_data[key]['sections']:
                    if 'prof' in section:
                        new_list[-1]["profs"].append(section['prof'])
        return jsonify(new_list)
    return jsonify({"error": "something went wrong when reading the date"})

@app.route("/load_timetable_data", methods=["POST"])
def load_timetable_data():
    cookie = request.form["cookie"]
    if cookie:
        cookie = cookie.split[':']
        print(cookie)



if __name__ == '__main__':
    #app.run(host="0.0.0.0")
    app.run(debug=True)

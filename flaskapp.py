from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

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
@app.route('/load_search_data')
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


@app.route('/submit', methods=['POST'])
def submit():
    code = request.form['code']
    date = request.form['date']

    if code and date:
        fp = open("data/" + date + "_min.json", "r")
        json_data = json.load(fp)
        fp.close()
        new_json_data = {} 
        new_json_data[code] = json_data[code]
        num = 1
        while code + "-" + str(num) in json_data:
            # everything is in reverse in new pdf thanks to section number... 
            new_json_data[code + "-" + str(num)] = json_data[code + "-" + str(num)]
            num += 1
        return jsonify(new_json_data)
    
    return jsonify({'error': 'Missing data!'})

if __name__ == '__main__':
    app.run(host="0.0.0.0")

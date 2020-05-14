from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/date_data', methods=['POST'])
def date_data():
    date = request.form['date']
    if date:
        #print(date)
        fp = open("data/" + date + "_min.json", "r")
        json_data = json.load(fp)
        fp.close()
        return jsonify(list(json_data.keys()))
    return jsonify({"error": "something went wrong when reading the date"})


@app.route('/submit', methods=['POST'])
def submit():
    code = request.form['code']
    date = request.form['date']

    if code and date:
        fp = open("data/" + date + "_min.json", "r")
        json_data = json.load(fp)
        fp.close()
        new_json_data = []
        new_json_data.append(json_data[code])
        num = 1
        while code + "-" + str(num) in json_data:
            # everything is in reverse in new pdf wtf are they doing?!?!
            if date == "s2020":
                new_json_data.insert(0, json_data[code + "-" + str(num)])
            else:
                new_json_data.append(json_data[code + "-" + str(num)])

            num += 1
        return jsonify(new_json_data)
    
    return jsonify({'error': 'Missing data!'})

if __name__ == '__main__':
    app.run()
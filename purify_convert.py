import json

def purify(filename):
    with open(f'subtitles/{filename}.txt', 'r') as f:
        text = f.read()
    text = text.replace('\n', ' ')
    with open(f'subtitles/{filename}_clean.txt', 'w') as f:
        f.write(text)

def convert(filename, inputName, outputName): # ANDREW HUBERMAN n DAVID GOGGINS
    with open(f'subtitles/{filename}_clean.txt', 'r') as f:
        text = f.read()
    toJSON = []
    split1 = text.split(f'{inputName}: ')[1:]
    for para in split1:
        split2 = para.split(f' {outputName}: ')
        convo = {
            'input': split2[0],
            'output': split2[1]
        }
        toJSON.append(convo)
    with open(f'jsonData/{filename}_JSON.json', 'w') as f:
        json.dump(toJSON, f, indent=4)

convert('goggins1', 'ANDREW HUBERMAN', 'DAVID GOGGINS')

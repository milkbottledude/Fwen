import json

def purify(filename, folder='subtitles'):
    with open(f'{folder}/{filename}.txt', 'r') as f:
        text = f.read()
    text = text.replace('\n', ' ')
    text = text.replace('"', "'")
    with open(f'{folder}/{filename}_clean.txt', 'w') as f:
        f.write(text)

purify('goggins2')

def convert(filename, inputName, outputName):
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

convert('goggins2', 'Tom', 'David')

def combineJSON(name, num):
    combined = []
    for i in range(1, num+1):
        with open(f'jsonData/{name}{i}_JSON.json', 'r') as f:
            smolList = json.load(f)
        combined.extend(smolList)
    with open(f'jsonData/{name}_JSON.json', 'w') as f:
        json.dump(combined, f, indent=4)

combineJSON('goggins', 2)
        

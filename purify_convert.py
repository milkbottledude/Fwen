import json

def purify(filename, folder='subtitles'):
    with open(f'{folder}/{filename}.txt', 'r') as f:
        text = f.read()
    for dirt in ['[music]']: #, '>>'
        text = text.replace(dirt, '')
    text = text.replace('[Â\xa0__Â\xa0]', 'damn')
    text = text.replace('\n', ' ')
    text = text.replace('"', "'")
    with open(f'{folder}/{filename}_clean.txt', 'w') as f:
        f.write(text)

# purify('holo1')

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

def convert2(filename):
    with open(f'subtitles/{filename}_clean.txt', 'r') as f:
        text = f.read()
    textArr = text.split(' >> ')
    print(len(textArr))
    with open(f'jsonData/{filename[:-1]}_JSON.json', 'r') as f:
        toJSON = json.load(f)
    while len(textArr) > 1:
        toJSON.append({
            'input': textArr.pop(0),
            'output': textArr.pop(0)
        })
    with open(f'jsonData/{filename[:-1]}_JSON.json', 'w') as f:
        json.dump(toJSON, f, indent=4)

# for i in range(1, 3):
#     convert2(f'gooba{i}')

with open('subtitles/holo1_clean.txt', 'r') as f:
    text = f.read()
    print(repr(text[:1000]))
    


# convert('goggins2', 'Tom', 'David')

def combineJSON(name, num):
    combined = []
    for i in range(1, num+1):
        with open(f'jsonData/{name}{i}_JSON.json', 'r') as f:
            smolList = json.load(f)
        combined.extend(smolList)
    with open(f'jsonData/{name}_JSON.json', 'w') as f:
        json.dump(combined, f, indent=4)

# combineJSON('goggins', 2)
        
def monologue1(name):
    try:
        with open(f'jsonData/{name}_mono.json', 'r') as f:
            just_me = json.load(f)
    except FileNotFoundError:
        just_me = []    
    with open(f'jsonData/{name}_JSON.json', 'r') as f:
        convo = json.load(f)
        for pair in convo:
            mono_dict = {
                'input': "",
                'output': pair['output']
            }
            just_me.append(mono_dict)
    with open(f'jsonData/{name}_mono.json', 'w') as f:
        json.dump(just_me, f, indent=4)

# monologue('goggins')

def monologue2(name, toMain=False): # straight from clean txt to json
    if toMain:
        with open(f'jsonData/{name[:-1]}_mono.json', 'r') as f:
            just_me = json.load(f)
    else:
        just_me = []    
    with open(f'subtitles/{name}_clean.txt', 'r') as f:
        text = f.read()
    textArr = text.split('. ')
    for speech in textArr:
        speech = speech.replace('[Â\xa0__Â\xa0]', 'damn')
        mono_dict = {
            'input': '',
            'output': speech
        }
        just_me.append(mono_dict)
    if toMain:
        with open(f'jsonData/{name[:-1]}_mono.json', 'w') as f:
            json.dump(just_me, f, indent=4)  
    else:        
        with open(f'jsonData/{name}_mono.json', 'w') as f:
            json.dump(just_me, f, indent=4)    

# for i in range(3, 7):
#     monologue2(f'goggins{i}', toMain=True) 


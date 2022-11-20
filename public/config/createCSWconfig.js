
const fs = require('fs')
const filename = 'champion_CSW.json'

fs.readFile('champion.json', 'utf8', async (err, data) => {
    const myJson = await JSON.parse(data)
    createJson(myJson)
})

function createJson(json) {
    let allChamps = {}
    for (let [key, value] of Object.entries(json.data)) {
        allChamps = {...allChamps, [key]: {
                CSW_score: 50,
                name: value.name,
                image: value.image.full
            }}
    }
    fs.writeFile(filename, JSON.stringify(allChamps), function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
}
const fs = require('fs')

let DDallchamps = undefined
let myAllchamps = undefined

DDallchamps = fs.readFileSync('champion.json', 'utf8')
DDallchamps = JSON.parse(DDallchamps)
myAllchamps = fs.readFileSync('champion_CSW_save_recent.json', 'utf8')
myAllchamps = JSON.parse(myAllchamps)

const myAllchampsCpy = updateJson(DDallchamps, myAllchamps)


function updateJson(DDallchamps, myAllchamps) {
	let myAllchampsCpy = JSON.parse(JSON.stringify(myAllchamps))
	for (let [key, value] of Object.entries(DDallchamps.data)) {
		const champId = value.key
		for (let keyChamp of Object.keys(myAllchamps)) {
			if (keyChamp === key) {
				myAllchampsCpy[`${keyChamp}`]['nameFormatted'] = key
				myAllchampsCpy[`${keyChamp}`]['id'] = champId
			}
		}
	}
	return myAllchampsCpy
}

fs.writeFileSync('champion_CSW_save2.json', JSON.stringify(myAllchampsCpy));
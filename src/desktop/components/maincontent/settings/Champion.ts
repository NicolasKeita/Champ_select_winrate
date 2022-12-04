/*
    Path + Filename: src/desktop/components/maincontent/settings/Champion.ts
*/

class Champion {
	public name: string
	public opScore_CSW
	public opScore_user
	public role: string
	public image: string

	constructor(name = '', opScore_user = 50, opScore_CSW = 50) {
		this.name = name
		this.opScore_user = opScore_user
		this.opScore_CSW = opScore_CSW
		this.role = ''
		this.image = ''
	}

	toPlainObj(): Champion {
		return Object.assign({}, this)
	}
}

export default Champion

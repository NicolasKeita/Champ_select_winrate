const championAttributes = {
	HEALER_ISH: 'Healer-ish',
	POTENTIAL_GREVIOUS_WOUNDS: 'Potential Grievous Wounds',
	UNKILLABLE_LANER: 'Unkillable laner',
	POTENTIAL_ZHONYA_OWNER: 'Potential Zhonya owner',
	LANE_BULLY: 'Lane Bully',
	CC: 'CC',
	AP: 'AP',
	AD: 'AD',
	TANK: 'TANK'
}

// if lane bully -> added automatically weak vs unkillable laner
// if unkillable laner -> add godo vs lane bully

const allChamps = {
	Aatrox: {
		opScore_CSW: 69,
		role: 'top',
		name: 'Aatrox',
		image: 'Aatrox.png',
		nameFormatted: 'Aatrox',
		id: '266',
		tags: {
			attributes: [
				championAttributes.HEALER_ISH,
				championAttributes.UNKILLABLE_LANER,
				championAttributes.AD
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Ahri: {
		opScore_CSW: 64,
		role: 'middle',
		name: 'Ahri',
		image: 'Ahri.png',
		nameFormatted: 'Ahri',
		id: '103',
		tags: {
			attributes: [
				championAttributes.UNKILLABLE_LANER,
				championAttributes.CC
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Akali: {
		opScore_CSW: 75,
		role: 'middle',
		name: 'Akali',
		image: 'Akali.png',
		nameFormatted: 'Akali',
		id: '84',
		tags: {
			attributes: [
				championAttributes.UNKILLABLE_LANER,
				championAttributes.AP
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Akshan: {
		opScore_CSW: 70,
		role: 'middle',
		name: 'Akshan',
		image: 'Akshan.png',
		nameFormatted: 'Akshan',
		id: '166',
		tags: {
			attributes: [
				championAttributes.UNKILLABLE_LANER,
				championAttributes.AD
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Alistar: {
		opScore_CSW: 40,
		role: 'utility',
		name: 'Alistar',
		image: 'Alistar.png',
		nameFormatted: 'Alistar',
		id: '12',
		tags: {
			attributes: [championAttributes.TANK, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Amumu: {
		opScore_CSW: 62,
		role: 'support',
		name: 'Amumu',
		image: 'Amumu.png',
		nameFormatted: 'Amumu',
		id: '32',
		tags: {
			attributes: [championAttributes.TANK, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Anivia: {
		opScore_CSW: 63,
		role: 'middle',
		name: 'Anivia',
		image: 'Anivia.png',
		nameFormatted: 'Anivia',
		id: '34',
		tags: {
			attributes: [
				championAttributes.POTENTIAL_ZHONYA_OWNER,
				championAttributes.AP,
				championAttributes.CC
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Annie: {
		opScore_CSW: 43,
		role: 'middle',
		name: 'Annie',
		image: 'Annie.png',
		nameFormatted: 'Annie',
		id: '1',
		tags: {
			attributes: [championAttributes.AP, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Aphelios: {
		opScore_CSW: 50,
		role: 'bottom',
		name: 'Aphelios',
		image: 'Aphelios.png',
		nameFormatted: 'Aphelios',
		id: '523',
		tags: {
			attributes: [championAttributes.AD],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Ashe: {
		opScore_CSW: 48,
		role: 'bottom',
		name: 'Ashe',
		image: 'Ashe.png',
		nameFormatted: 'Ashe',
		id: '22',
		tags: {
			attributes: [championAttributes.AD, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	AurelionSol: {
		opScore_CSW: 63,
		role: 'middle',
		name: 'Aurelion Sol',
		image: 'AurelionSol.png',
		nameFormatted: 'AurelionSol',
		id: '136',
		tags: {
			attributes: [championAttributes.AP, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Azir: {
		opScore_CSW: 45,
		role: 'middle',
		name: 'Azir',
		image: 'Azir.png',
		nameFormatted: 'Azir',
		id: '268',
		tags: {
			attributes: [championAttributes.AP, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Bard: {
		opScore_CSW: 64,
		role: 'utility',
		name: 'Bard',
		image: 'Bard.png',
		nameFormatted: 'Bard',
		id: '432',
		tags: {
			attributes: [championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Belveth: {
		opScore_CSW: 68,
		role: 'jungle',
		name: "Bel'Veth",
		image: 'Belveth.png',
		nameFormatted: 'Belveth',
		id: '200',
		tags: {
			attributes: [championAttributes.AD, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Blitzcrank: {
		opScore_CSW: 55,
		role: 'utility',
		name: 'Blitzcrank',
		image: 'Blitzcrank.png',
		nameFormatted: 'Blitzcrank',
		id: '53',
		tags: {
			attributes: [championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Brand: {
		opScore_CSW: 57,
		role: 'utility',
		name: 'Brand',
		image: 'Brand.png',
		nameFormatted: 'Brand',
		id: '63',
		tags: {
			attributes: [championAttributes.AP, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Braum: {
		opScore_CSW: 40,
		role: 'utility',
		name: 'Braum',
		image: 'Braum.png',
		nameFormatted: 'Braum',
		id: '201',
		tags: {
			attributes: [championAttributes.TANK, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Caitlyn: {
		opScore_CSW: 75,
		role: 'bottom',
		name: 'Caitlyn',
		image: 'Caitlyn.png',
		nameFormatted: 'Caitlyn',
		id: '51',
		tags: {
			attributes: [championAttributes.AD],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Camille: {
		opScore_CSW: 72,
		role: 'top',
		name: 'Camille',
		image: 'Camille.png',
		nameFormatted: 'Camille',
		id: '164',
		tags: {
			attributes: [championAttributes.AD, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Cassiopeia: {
		opScore_CSW: 54,
		role: 'middle',
		name: 'Cassiopeia',
		image: 'Cassiopeia.png',
		nameFormatted: 'Cassiopeia',
		id: '69',
		tags: {
			attributes: [championAttributes.AD, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Chogath: {
		opScore_CSW: 60,
		role: 'top',
		name: "Cho'Gath",
		image: 'Chogath.png',
		nameFormatted: 'Chogath',
		id: '31',
		tags: {
			attributes: [championAttributes.TANK, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Corki: {
		opScore_CSW: 60,
		role: 'middle',
		name: 'Corki',
		image: 'Corki.png',
		nameFormatted: 'Corki',
		id: '42',
		tags: {
			attributes: [championAttributes.AP],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Darius: {
		opScore_CSW: 65,
		role: 'top',
		name: 'Darius',
		image: 'Darius.png',
		nameFormatted: 'Darius',
		id: '122',
		tags: {
			attributes: [championAttributes.AD],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Diana: {
		opScore_CSW: 71,
		role: 'jungle',
		name: 'Diana',
		image: 'Diana.png',
		nameFormatted: 'Diana',
		id: '131',
		tags: {
			attributes: [championAttributes.AP],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Draven: {
		opScore_CSW: 48,
		role: 'bottom',
		name: 'Draven',
		image: 'Draven.png',
		nameFormatted: 'Draven',
		id: '119',
		tags: {
			attributes: [championAttributes.AD],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	DrMundo: {
		opScore_CSW: 65,
		role: 'jungle',
		name: 'Dr. Mundo',
		image: 'DrMundo.png',
		nameFormatted: 'DrMundo',
		id: '36',
		tags: {
			attributes: [
				championAttributes.TANK,
				championAttributes.HEALER_ISH
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Ekko: {
		opScore_CSW: 66,
		role: 'jungle',
		name: 'Ekko',
		image: 'Ekko.png',
		nameFormatted: 'Ekko',
		id: '245',
		tags: {
			attributes: [championAttributes.AP],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Elise: {
		opScore_CSW: 49,
		role: 'jungle',
		name: 'Elise',
		image: 'Elise.png',
		nameFormatted: 'Elise',
		id: '60',
		tags: {
			attributes: [championAttributes.AP, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Evelynn: {
		opScore_CSW: 69,
		role: 'jungle',
		name: 'Evelynn',
		image: 'Evelynn.png',
		nameFormatted: 'Evelynn',
		id: '28',
		tags: {
			attributes: [championAttributes.AP, championAttributes.CC],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Ezreal: {
		opScore_CSW: 45,
		role: 'bottom',
		name: 'Ezreal',
		image: 'Ezreal.png',
		nameFormatted: 'Ezreal',
		id: '81',
		tags: {
			attributes: [championAttributes.AD],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Fiddlesticks: {
		opScore_CSW: 70,
		role: 'jungle',
		name: 'Fiddlesticks',
		image: 'Fiddlesticks.png',
		nameFormatted: 'Fiddlesticks',
		id: '9',
		tags: {
			attributes: [
				championAttributes.AP,
				championAttributes.CC,
				championAttributes.HEALER_ISH
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Fiora: {
		opScore_CSW: 73,
		role: 'top',
		name: 'Fiora',
		image: 'Fiora.png',
		nameFormatted: 'Fiora',
		id: '114',
		tags: {
			attributes: [championAttributes.AD, championAttributes.HEALER_ISH],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Fizz: {
		opScore_CSW: 48,
		role: 'middle',
		name: 'Fizz',
		image: 'Fizz.png',
		nameFormatted: 'Fizz',
		id: '105',
		tags: {
			attributes: [
				championAttributes.AP,
				championAttributes.POTENTIAL_ZHONYA_OWNER
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Galio: {
		opScore_CSW: 60,
		role: 'middle',
		name: 'Galio',
		image: 'Galio.png',
		nameFormatted: 'Galio',
		id: '3',
		tags: {
			attributes: [
				championAttributes.AP,
				championAttributes.POTENTIAL_ZHONYA_OWNER
			],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Gangplank: {
		opScore_CSW: 67,
		role: 'top',
		name: 'Gangplank',
		image: 'Gangplank.png',
		nameFormatted: 'Gangplank',
		id: '41',
		tags: {
			attributes: [championAttributes.AD, championAttributes.LANE_BULLY],
			strongAgainst: [],
			weakAgainst: []
		}
	},
	Garen: {
		opScore_CSW: 73,
		role: 'top',
		name: 'Garen',
		image: 'Garen.png',
		nameFormatted: 'Garen',
		id: '86'
	},
	Gnar: {
		opScore_CSW: 53,
		role: 'top',
		name: 'Gnar',
		image: 'Gnar.png',
		nameFormatted: 'Gnar',
		id: '150'
	},
	Gragas: {
		opScore_CSW: 71,
		role: 'top',
		name: 'Gragas',
		image: 'Gragas.png',
		nameFormatted: 'Gragas',
		id: '79'
	},
	Graves: {
		opScore_CSW: 72,
		role: 'jungle',
		name: 'Graves',
		image: 'Graves.png',
		nameFormatted: 'Graves',
		id: '104'
	},
	Gwen: {
		opScore_CSW: 50,
		role: 'top',
		name: 'Gwen',
		image: 'Gwen.png',
		nameFormatted: 'Gwen',
		id: '887'
	},
	Hecarim: {
		opScore_CSW: 70,
		role: 'jungle',
		name: 'Hecarim',
		image: 'Hecarim.png',
		nameFormatted: 'Hecarim',
		id: '120'
	},
	Heimerdinger: {
		opScore_CSW: 60,
		role: 'middle',
		name: 'Heimerdinger',
		image: 'Heimerdinger.png',
		nameFormatted: 'Heimerdinger',
		id: '74'
	},
	Illaoi: {
		opScore_CSW: 67,
		role: 'top',
		name: 'Illaoi',
		image: 'Illaoi.png',
		nameFormatted: 'Illaoi',
		id: '420'
	},
	Irelia: {
		opScore_CSW: 53,
		role: 'middle',
		name: 'Irelia',
		image: 'Irelia.png',
		nameFormatted: 'Irelia',
		id: '39'
	},
	Ivern: {
		opScore_CSW: 65,
		role: 'jungle',
		name: 'Ivern',
		image: 'Ivern.png',
		nameFormatted: 'Ivern',
		id: '427'
	},
	Janna: {
		opScore_CSW: 68,
		role: 'utility',
		name: 'Janna',
		image: 'Janna.png',
		nameFormatted: 'Janna',
		id: '40'
	},
	JarvanIV: {
		opScore_CSW: 62,
		role: 'jungle',
		name: 'Jarvan IV',
		image: 'JarvanIV.png',
		nameFormatted: 'JarvanIV',
		id: '59'
	},
	Jax: {
		opScore_CSW: 54,
		role: 'top',
		name: 'Jax',
		image: 'Jax.png',
		nameFormatted: 'Jax',
		id: '24'
	},
	Jayce: {
		opScore_CSW: 43,
		role: 'top',
		name: 'Jayce',
		image: 'Jayce.png',
		nameFormatted: 'Jayce',
		id: '126'
	},
	Jhin: {
		opScore_CSW: 66,
		role: 'bottom',
		name: 'Jhin',
		image: 'Jhin.png',
		nameFormatted: 'Jhin',
		id: '202'
	},
	Jinx: {
		opScore_CSW: 55,
		role: 'bottom',
		name: 'Jinx',
		image: 'Jinx.png',
		nameFormatted: 'Jinx',
		id: '222'
	},
	Kaisa: {
		opScore_CSW: 64,
		role: 'bottom',
		name: "Kai'Sa",
		image: 'Kaisa.png',
		nameFormatted: 'Kaisa',
		id: '145'
	},
	Kalista: {
		opScore_CSW: 45,
		role: 'bottom',
		name: 'Kalista',
		image: 'Kalista.png',
		nameFormatted: 'Kalista',
		id: '429'
	},
	Karma: {
		opScore_CSW: 56,
		role: 'utility',
		name: 'Karma',
		image: 'Karma.png',
		nameFormatted: 'Karma',
		id: '43'
	},
	Karthus: {
		opScore_CSW: 70,
		role: 'jungle',
		name: 'Karthus',
		image: 'Karthus.png',
		nameFormatted: 'Karthus',
		id: '30'
	},
	Kassadin: {
		opScore_CSW: 70,
		role: 'middle',
		name: 'Kassadin',
		image: 'Kassadin.png',
		nameFormatted: 'Kassadin',
		id: '38'
	},
	Katarina: {
		opScore_CSW: 57,
		role: 'middle',
		name: 'Katarina',
		image: 'Katarina.png',
		nameFormatted: 'Katarina',
		id: '55'
	},
	Kayle: {
		opScore_CSW: 40,
		role: 'top',
		name: 'Kayle',
		image: 'Kayle.png',
		nameFormatted: 'Kayle',
		id: '10'
	},
	Kayn: {
		opScore_CSW: 67,
		role: 'jungle',
		name: 'Kayn',
		image: 'Kayn.png',
		nameFormatted: 'Kayn',
		id: '141'
	},
	Kennen: {
		opScore_CSW: 50,
		role: 'top',
		name: 'Kennen',
		image: 'Kennen.png',
		nameFormatted: 'Kennen',
		id: '85'
	},
	Khazix: {
		opScore_CSW: 70,
		role: 'jungle',
		name: "Kha'Zix",
		image: 'Khazix.png',
		nameFormatted: 'Khazix',
		id: '121'
	},
	Kindred: {
		opScore_CSW: 55,
		role: 'jungle',
		name: 'Kindred',
		image: 'Kindred.png',
		nameFormatted: 'Kindred',
		id: '203'
	},
	Kled: {
		opScore_CSW: 68,
		role: 'top',
		name: 'Kled',
		image: 'Kled.png',
		nameFormatted: 'Kled',
		id: '240'
	},
	KogMaw: {
		opScore_CSW: 45,
		role: 'bottom',
		name: "Kog'Maw",
		image: 'KogMaw.png',
		nameFormatted: 'KogMaw',
		id: '96'
	},
	KSante: {
		opScore_CSW: 75,
		role: 'top',
		name: "K'Sante",
		image: 'KSante.png',
		nameFormatted: 'KSante',
		id: '897'
	},
	Leblanc: {
		opScore_CSW: 55,
		role: 'middle',
		name: 'LeBlanc',
		image: 'Leblanc.png',
		nameFormatted: 'Leblanc',
		id: '7'
	},
	LeeSin: {
		opScore_CSW: 43,
		role: 'jungle',
		name: 'Lee Sin',
		image: 'LeeSin.png',
		nameFormatted: 'LeeSin',
		id: '64'
	},
	Leona: {
		opScore_CSW: 56,
		role: 'utility',
		name: 'Leona',
		image: 'Leona.png',
		nameFormatted: 'Leona',
		id: '89'
	},
	Lillia: {
		opScore_CSW: 72,
		role: 'jungle',
		name: 'Lillia',
		image: 'Lillia.png',
		nameFormatted: 'Lillia',
		id: '876'
	},
	Lissandra: {
		opScore_CSW: 55,
		role: 'middle',
		name: 'Lissandra',
		image: 'Lissandra.png',
		nameFormatted: 'Lissandra',
		id: '127'
	},
	Lucian: {
		opScore_CSW: 43,
		role: 'bottom',
		name: 'Lucian',
		image: 'Lucian.png',
		nameFormatted: 'Lucian',
		id: '236'
	},
	Lulu: {
		opScore_CSW: 56,
		role: 'utility',
		name: 'Lulu',
		image: 'Lulu.png',
		nameFormatted: 'Lulu',
		id: '117'
	},
	Lux: {
		opScore_CSW: 54,
		role: 'utility',
		name: 'Lux',
		image: 'Lux.png',
		nameFormatted: 'Lux',
		id: '99'
	},
	Malphite: {
		opScore_CSW: 57,
		role: 'top',
		name: 'Malphite',
		image: 'Malphite.png',
		nameFormatted: 'Malphite',
		id: '54'
	},
	Malzahar: {
		opScore_CSW: 55,
		role: 'middle',
		name: 'Malzahar',
		image: 'Malzahar.png',
		nameFormatted: 'Malzahar',
		id: '90'
	},
	Maokai: {
		opScore_CSW: 55,
		role: 'utility',
		name: 'Maokai',
		image: 'Maokai.png',
		nameFormatted: 'Maokai',
		id: '57'
	},
	MasterYi: {
		opScore_CSW: 56,
		role: 'jungle',
		name: 'Master Yi',
		image: 'MasterYi.png',
		nameFormatted: 'MasterYi',
		id: '11'
	},
	MissFortune: {
		opScore_CSW: 63,
		role: 'bottom',
		name: 'Miss Fortune',
		image: 'MissFortune.png',
		nameFormatted: 'MissFortune',
		id: '21'
	},
	MonkeyKing: {
		opScore_CSW: 63,
		role: 'jungle',
		name: 'Wukong',
		image: 'MonkeyKing.png',
		nameFormatted: 'MonkeyKing',
		id: '62'
	},
	Mordekaiser: {
		opScore_CSW: 62,
		role: 'top',
		name: 'Mordekaiser',
		image: 'Mordekaiser.png',
		nameFormatted: 'Mordekaiser',
		id: '82'
	},
	Morgana: {
		opScore_CSW: 52,
		role: 'utility',
		name: 'Morgana',
		image: 'Morgana.png',
		nameFormatted: 'Morgana',
		id: '25'
	},
	Nami: {
		opScore_CSW: 52,
		role: 'utility',
		name: 'Nami',
		image: 'Nami.png',
		nameFormatted: 'Nami',
		id: '267'
	},
	Nasus: {
		opScore_CSW: 63,
		role: 'top',
		name: 'Nasus',
		image: 'Nasus.png',
		nameFormatted: 'Nasus',
		id: '75'
	},
	Nautilus: {
		opScore_CSW: 55,
		role: 'utility',
		name: 'Nautilus',
		image: 'Nautilus.png',
		nameFormatted: 'Nautilus',
		id: '111'
	},
	Neeko: {
		opScore_CSW: 55,
		role: 'middle',
		name: 'Neeko',
		image: 'Neeko.png',
		nameFormatted: 'Neeko',
		id: '518'
	},
	Nidalee: {
		opScore_CSW: 30,
		role: 'jungle',
		name: 'Nidalee',
		image: 'Nidalee.png',
		nameFormatted: 'Nidalee',
		id: '76'
	},
	Nilah: {
		opScore_CSW: 45,
		role: 'bottom',
		name: 'Nilah',
		image: 'Nilah.png',
		nameFormatted: 'Nilah',
		id: '895'
	},
	Nocturne: {
		opScore_CSW: 65,
		role: 'jungle',
		name: 'Nocturne',
		image: 'Nocturne.png',
		nameFormatted: 'Nocturne',
		id: '56'
	},
	Nunu: {
		opScore_CSW: 60,
		role: 'jungle',
		name: 'Nunu & Willump',
		image: 'Nunu.png',
		nameFormatted: 'Nunu',
		id: '20'
	},
	Olaf: {
		opScore_CSW: 57,
		role: 'top',
		name: 'Olaf',
		image: 'Olaf.png',
		nameFormatted: 'Olaf',
		id: '2'
	},
	Orianna: {
		opScore_CSW: 40,
		role: 'middle',
		name: 'Orianna',
		image: 'Orianna.png',
		nameFormatted: 'Orianna',
		id: '61'
	},
	Ornn: {
		opScore_CSW: 60,
		role: 'jungle',
		name: 'Ornn',
		image: 'Ornn.png',
		nameFormatted: 'Ornn',
		id: '516'
	},
	Pantheon: {
		opScore_CSW: 65,
		role: 'jungle',
		name: 'Pantheon',
		image: 'Pantheon.png',
		nameFormatted: 'Pantheon',
		id: '80'
	},
	Poppy: {
		opScore_CSW: 63,
		role: 'jungle',
		name: 'Poppy',
		image: 'Poppy.png',
		nameFormatted: 'Poppy',
		id: '78'
	},
	Pyke: {
		opScore_CSW: 61,
		role: 'utility',
		name: 'Pyke',
		image: 'Pyke.png',
		nameFormatted: 'Pyke',
		id: '555'
	},
	Qiyana: {
		opScore_CSW: 55,
		role: 'middle',
		name: 'Qiyana',
		image: 'Qiyana.png',
		nameFormatted: 'Qiyana',
		id: '246'
	},
	Quinn: {
		opScore_CSW: 55,
		role: 'top',
		name: 'Quinn',
		image: 'Quinn.png',
		nameFormatted: 'Quinn',
		id: '133'
	},
	Rakan: {
		opScore_CSW: 44,
		role: 'utility',
		name: 'Rakan',
		image: 'Rakan.png',
		nameFormatted: 'Rakan',
		id: '497'
	},
	Rammus: {
		opScore_CSW: 60,
		role: 'jungle',
		name: 'Rammus',
		image: 'Rammus.png',
		nameFormatted: 'Rammus',
		id: '33'
	},
	RekSai: {
		opScore_CSW: 53,
		role: 'jungle',
		name: "Rek'Sai",
		image: 'RekSai.png',
		nameFormatted: 'RekSai',
		id: '421'
	},
	Rell: {
		opScore_CSW: 49,
		role: 'utility',
		name: 'Rell',
		image: 'Rell.png',
		nameFormatted: 'Rell',
		id: '526'
	},
	Renata: {
		opScore_CSW: 54,
		role: 'utility',
		name: 'Renata Glasc',
		image: 'Renata.png',
		nameFormatted: 'Renata',
		id: '888'
	},
	Renekton: {
		opScore_CSW: 60,
		role: 'top',
		name: 'Renekton',
		image: 'Renekton.png',
		nameFormatted: 'Renekton',
		id: '58'
	},
	Rengar: {
		opScore_CSW: 45,
		role: 'jungle',
		name: 'Rengar',
		image: 'Rengar.png',
		nameFormatted: 'Rengar',
		id: '107'
	},
	Riven: {
		opScore_CSW: 55,
		role: 'top',
		name: 'Riven',
		image: 'Riven.png',
		nameFormatted: 'Riven',
		id: '92'
	},
	Rumble: {
		opScore_CSW: 50,
		role: 'top',
		name: 'Rumble',
		image: 'Rumble.png',
		nameFormatted: 'Rumble',
		id: '68'
	},
	Ryze: {
		opScore_CSW: 48,
		role: 'middle',
		name: 'Ryze',
		image: 'Ryze.png',
		nameFormatted: 'Ryze',
		id: '13'
	},
	Samira: {
		opScore_CSW: 50,
		role: 'bottom',
		name: 'Samira',
		image: 'Samira.png',
		nameFormatted: 'Samira',
		id: '360'
	},
	Sejuani: {
		opScore_CSW: 63,
		role: 'jungle',
		name: 'Sejuani',
		image: 'Sejuani.png',
		nameFormatted: 'Sejuani',
		id: '113'
	},
	Senna: {
		opScore_CSW: 56,
		role: 'utility',
		name: 'Senna',
		image: 'Senna.png',
		nameFormatted: 'Senna',
		id: '235'
	},
	Seraphine: {
		opScore_CSW: 56,
		role: 'utility',
		name: 'Seraphine',
		image: 'Seraphine.png',
		nameFormatted: 'Seraphine',
		id: '147'
	},
	Sett: {
		opScore_CSW: 63,
		role: 'top',
		name: 'Sett',
		image: 'Sett.png',
		nameFormatted: 'Sett',
		id: '875'
	},
	Shaco: {
		opScore_CSW: 67,
		role: 'jungle',
		name: 'Shaco',
		image: 'Shaco.png',
		nameFormatted: 'Shaco',
		id: '35'
	},
	Shen: {
		opScore_CSW: 52,
		role: 'top',
		name: 'Shen',
		image: 'Shen.png',
		nameFormatted: 'Shen',
		id: '98'
	},
	Shyvana: {
		opScore_CSW: 68,
		role: 'jungle',
		name: 'Shyvana',
		image: 'Shyvana.png',
		nameFormatted: 'Shyvana',
		id: '102'
	},
	Singed: {
		opScore_CSW: 70,
		role: 'top',
		name: 'Singed',
		image: 'Singed.png',
		nameFormatted: 'Singed',
		id: '27'
	},
	Sion: {
		opScore_CSW: 70,
		role: 'top',
		name: 'Sion',
		image: 'Sion.png',
		nameFormatted: 'Sion',
		id: '14'
	},
	Sivir: {
		opScore_CSW: 62,
		role: 'bottom',
		name: 'Sivir',
		image: 'Sivir.png',
		nameFormatted: 'Sivir',
		id: '15'
	},
	Skarner: {
		opScore_CSW: 50,
		role: 'jungle',
		name: 'Skarner',
		image: 'Skarner.png',
		nameFormatted: 'Skarner',
		id: '72'
	},
	Sona: {
		opScore_CSW: 50,
		role: 'utility',
		name: 'Sona',
		image: 'Sona.png',
		nameFormatted: 'Sona',
		id: '37'
	},
	Soraka: {
		opScore_CSW: 57,
		role: 'utility',
		name: 'Soraka',
		image: 'Soraka.png',
		nameFormatted: 'Soraka',
		id: '16'
	},
	Swain: {
		opScore_CSW: 63,
		role: 'utility',
		name: 'Swain',
		image: 'Swain.png',
		nameFormatted: 'Swain',
		id: '50'
	},
	Sylas: {
		opScore_CSW: 75,
		role: 'middle',
		name: 'Sylas',
		image: 'Sylas.png',
		nameFormatted: 'Sylas',
		id: '517'
	},
	Syndra: {
		opScore_CSW: 60,
		role: 'middle',
		name: 'Syndra',
		image: 'Syndra.png',
		nameFormatted: 'Syndra',
		id: '134'
	},
	TahmKench: {
		opScore_CSW: 60,
		role: 'top',
		name: 'Tahm Kench',
		image: 'TahmKench.png',
		nameFormatted: 'TahmKench',
		id: '223'
	},
	Taliyah: {
		opScore_CSW: 66,
		role: 'jungle',
		name: 'Taliyah',
		image: 'Taliyah.png',
		nameFormatted: 'Taliyah',
		id: '163'
	},
	Talon: {
		opScore_CSW: 35,
		role: 'middle',
		name: 'Talon',
		image: 'Talon.png',
		nameFormatted: 'Talon',
		id: '91'
	},
	Taric: {
		opScore_CSW: 45,
		role: 'utility',
		name: 'Taric',
		image: 'Taric.png',
		nameFormatted: 'Taric',
		id: '44'
	},
	Teemo: {
		opScore_CSW: 58,
		role: 'top',
		name: 'Teemo',
		image: 'Teemo.png',
		nameFormatted: 'Teemo',
		id: '17'
	},
	Thresh: {
		opScore_CSW: 46,
		role: 'utility',
		name: 'Thresh',
		image: 'Thresh.png',
		nameFormatted: 'Thresh',
		id: '412'
	},
	Tristana: {
		opScore_CSW: 49,
		role: 'bottom',
		name: 'Tristana',
		image: 'Tristana.png',
		nameFormatted: 'Tristana',
		id: '18'
	},
	Trundle: {
		opScore_CSW: 55,
		role: 'jungle',
		name: 'Trundle',
		image: 'Trundle.png',
		nameFormatted: 'Trundle',
		id: '48'
	},
	Tryndamere: {
		opScore_CSW: 57,
		role: 'top',
		name: 'Tryndamere',
		image: 'Tryndamere.png',
		nameFormatted: 'Tryndamere',
		id: '23'
	},
	TwistedFate: {
		opScore_CSW: 48,
		role: 'middle',
		name: 'Twisted Fate',
		image: 'TwistedFate.png',
		nameFormatted: 'TwistedFate',
		id: '4'
	},
	Twitch: {
		opScore_CSW: 60,
		role: 'bottom',
		name: 'Twitch',
		image: 'Twitch.png',
		nameFormatted: 'Twitch',
		id: '29'
	},
	Udyr: {
		opScore_CSW: 65,
		role: 'jungle',
		name: 'Udyr',
		image: 'Udyr.png',
		nameFormatted: 'Udyr',
		id: '77'
	},
	Urgot: {
		opScore_CSW: 58,
		role: 'top',
		name: 'Urgot',
		image: 'Urgot.png',
		nameFormatted: 'Urgot',
		id: '6'
	},
	Varus: {
		opScore_CSW: 63,
		role: 'bottom',
		name: 'Varus',
		image: 'Varus.png',
		nameFormatted: 'Varus',
		id: '110'
	},
	Vayne: {
		opScore_CSW: 40,
		role: 'bottom',
		name: 'Vayne',
		image: 'Vayne.png',
		nameFormatted: 'Vayne',
		id: '67'
	},
	Veigar: {
		opScore_CSW: 70,
		role: 'middle',
		name: 'Veigar',
		image: 'Veigar.png',
		nameFormatted: 'Veigar',
		id: '45'
	},
	Velkoz: {
		opScore_CSW: 57,
		role: 'utility',
		name: "Vel'Koz",
		image: 'Velkoz.png',
		nameFormatted: 'Velkoz',
		id: '161'
	},
	Vex: {
		opScore_CSW: 68,
		role: 'middle',
		name: 'Vex',
		image: 'Vex.png',
		nameFormatted: 'Vex',
		id: '711'
	},
	Vi: {
		opScore_CSW: 56,
		role: 'jungle',
		name: 'Vi',
		image: 'Vi.png',
		nameFormatted: 'Vi',
		id: '254'
	},
	Viego: {
		opScore_CSW: 72,
		role: 'jungle',
		name: 'Viego',
		image: 'Viego.png',
		nameFormatted: 'Viego',
		id: '234'
	},
	Viktor: {
		opScore_CSW: 70,
		role: 'middle',
		name: 'Viktor',
		image: 'Viktor.png',
		nameFormatted: 'Viktor',
		id: '112'
	},
	Vladimir: {
		opScore_CSW: 65,
		role: 'middle',
		name: 'Vladimir',
		image: 'Vladimir.png',
		nameFormatted: 'Vladimir',
		id: '8'
	},
	Volibear: {
		opScore_CSW: 67,
		role: 'jungle',
		name: 'Volibear',
		image: 'Volibear.png',
		nameFormatted: 'Volibear',
		id: '106'
	},
	Warwick: {
		opScore_CSW: 65,
		role: 'jungle',
		name: 'Warwick',
		image: 'Warwick.png',
		nameFormatted: 'Warwick',
		id: '19'
	},
	Xayah: {
		opScore_CSW: 55,
		role: 'bottom',
		name: 'Xayah',
		image: 'Xayah.png',
		nameFormatted: 'Xayah',
		id: '498'
	},
	Xerath: {
		opScore_CSW: 57,
		role: 'utility',
		name: 'Xerath',
		image: 'Xerath.png',
		nameFormatted: 'Xerath',
		id: '101'
	},
	XinZhao: {
		opScore_CSW: 55,
		role: 'jungle',
		name: 'Xin Zhao',
		image: 'XinZhao.png',
		nameFormatted: 'XinZhao',
		id: '5'
	},
	Yasuo: {
		opScore_CSW: 30,
		role: 'middle',
		name: 'Yasuo',
		image: 'Yasuo.png',
		nameFormatted: 'Yasuo',
		id: '157'
	},
	Yone: {
		opScore_CSW: 66,
		role: 'middle',
		name: 'Yone',
		image: 'Yone.png',
		nameFormatted: 'Yone',
		id: '777'
	},
	Yorick: {
		opScore_CSW: 64,
		role: 'top',
		name: 'Yorick',
		image: 'Yorick.png',
		nameFormatted: 'Yorick',
		id: '83'
	},
	Yuumi: {
		opScore_CSW: 60,
		role: 'utility',
		name: 'Yuumi',
		image: 'Yuumi.png',
		nameFormatted: 'Yuumi',
		id: '350'
	},
	Zac: {
		opScore_CSW: 63,
		role: 'jungle',
		name: 'Zac',
		image: 'Zac.png',
		nameFormatted: 'Zac',
		id: '154'
	},
	Zed: {
		opScore_CSW: 60,
		role: 'middle',
		name: 'Zed',
		image: 'Zed.png',
		nameFormatted: 'Zed',
		id: '238'
	},
	Zeri: {
		opScore_CSW: 50,
		role: 'bottom',
		name: 'Zeri',
		image: 'Zeri.png',
		nameFormatted: 'Zeri',
		id: '221'
	},
	Ziggs: {
		opScore_CSW: 60,
		role: 'middle',
		name: 'Ziggs',
		image: 'Ziggs.png',
		nameFormatted: 'Ziggs',
		id: '115'
	},
	Zilean: {
		opScore_CSW: 50,
		role: 'utility',
		name: 'Zilean',
		image: 'Zilean.png',
		nameFormatted: 'Zilean',
		id: '26'
	},
	Zoe: {
		opScore_CSW: 61,
		role: 'middle',
		name: 'Zoe',
		image: 'Zoe.png',
		nameFormatted: 'Zoe',
		id: '142'
	},
	Zyra: {
		opScore_CSW: 57,
		role: 'utility',
		name: 'Zyra',
		image: 'Zyra.png',
		nameFormatted: 'Zyra',
		id: '143'
	}
}

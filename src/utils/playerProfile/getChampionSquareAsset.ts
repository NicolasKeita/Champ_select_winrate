/*
    Path + Filename: src/utils/playerProfile/getChampionByKey.ts
*/

let championByIdCache = {};
let championJson = {};

async function getLatestChampionDDragon(language = "en_US") {

    if (championJson[language])
        return championJson[language];

    let response;
    let versionIndex = 0;
    do { // I loop over versions because 9.22.1 is broken
        const version = (await fetch('http://ddragon.leagueoflegends.com/api/versions.json').then(async(r) => await r.json()))[versionIndex++];

        response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`);
    }
    while (!response.ok)

    championJson[language] = await response.json();
    return championJson[language];
}
//http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/Aatrox.png
export async function getChampSquareAsset(champName, language = 'en_US') {
    let response;

    const version = (
        await fetch('http://ddragon.leagueoflegends.com/api/versions.json').
        then(async(r) => await r.json())
    )[0]
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champName}`

    // do { // I loop over versions because 9.22.1 is broken
    //     const version = (
    //         await fetch('http://ddragon.leagueoflegends.com/api/versions.json').
    //         then(async(r) => await r.json())
    //     )[versionIndex++]
    //
    //     response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champName}`)
    // }
    // while (!response.ok)

    console.log(await response)
//    const imgRes = await response.json()
//    console.log(imgRes)
    return ('')
   /*
    // Setup cache
    if (!championByIdCache[language]) {
        let json = await getLatestChampionDDragon(language);

        championByIdCache[language] = {};
        for (var championName in json.data) {
            if (!json.data.hasOwnProperty(championName))
                continue;

            const champInfo = json.data[championName];
            championByIdCache[language][champInfo.key] = champInfo;
        }
    }

    return championByIdCache[language][key]
    */
}

export async function getChampionByID(name, language = 'en_US') {
    return await getLatestChampionDDragon(language)[name]
}

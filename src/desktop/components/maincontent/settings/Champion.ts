/*
    Path + Filename: src/desktop/components/maincontent/settings/Champion.ts
*/

class Champion {
    public name
    public opScore_CSW
    public opScore_user

    public setUserScore = (score) => {
        this.opScore_user = score
    }
}

export default Champion
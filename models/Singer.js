class Singer {
    constructor(id,name, avatar, link){
        this.id  = id,
        this.name = name,
        this.avatar = avatar,
        this.link = link
    }
}

let arraySinger = [
    new Singer(1,'Jay Chou','https://photo-resize-zmp3.zadn.vn/w240h240_jpeg/avatars/f/3/f3ccdd27d2000e3f9255a7e3e2c48800_1349926257.jpg','https://zingmp3.vn/nghe-si/Jay-Chou'),
    new Singer(2,'Trương Học Hữu','https://photo-resize-zmp3.zadn.vn/w240h240_jpeg/avatars/6/8/68b3cc1e961737b9e611a9bdc06fe44c_1441597711.jpg','https://zingmp3.vn/nghe-si/Truong-Hoc-Huu')
]

module.exports = {Singer,arraySinger}
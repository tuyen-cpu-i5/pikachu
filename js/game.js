var COL = 14;
var ROW = 8;
var game = {
    score: 0,
    colMax: null,
    rowMax: null,
    selected: [
        [null, null],
        [null, null]
    ],
    selectedHint: [
        [null, null],
        [null, null]
    ],
    isSelected: null,
    arrMain: null,
    xTemp: null,
    yTemp: null,
    xTempHint: null,
    yTempHint: null,
    currentObject: null,
    currentObjectHint: null,
    level: 1,
    time: 50,
    numberHint: 3,
    numberConvert: 3,
    arrMarked: [],
    arrVertical: [],
    isConnect: null,
    timeCountDown: null,
    numeberPikachu: 7,
    gamePanel: null,
    listRandom: [],
    countPikachu: ROW * COL,
    start: function() {
        this.init();

    },
    init: function() {
        this.gamePanel = document.getElementById("pikachus");
        this.initPikachus(this.randomArr());
        this.initTime();

    },
    reset: function() {

        this.clear();
        this.start();
        this.score = 0;
        this.numberHint = 3;
        this.numberConvert = 3;
        this.clearTime();
        this.initTime();

    },
    initTime: function() {

        clearInterval(this.timeCountDown);
        this.timeCount = this.time;
        this.timeCountDown = setInterval(() => {
            this.showTime();
        }, 1000);

    },
    initPikachus: function(arr) {

        var table = document.createElement("table");
        // var tbody = document.createElement("tbody");
        // table.appendChild(tbody);
        this.gamePanel.appendChild(table);
        this.arrMain = arr;

        for (var i = 0; i < this.rowMax; i++) {
            var tr = document.createElement("tr");
            table.appendChild(tr);
            for (var j = 0; j < this.colMax; j++) {
                var pikachu1 = new pikachu(this, i, j, this.arrMain[i][j]);
                pikachu1.init();
                tr.appendChild(pikachu1.divPikachu);
            }
        }

    },
    randomArr: function() {
        this.rowMax = ROW + 2;
        this.colMax = COL + 2;
        var arr = [ROW * COL / 2];
        //sinh đôi
        var count = 1,
            index = 0;
        for (var i = 0; i < COL * ROW / 2; i++) {
            if (count > this.numeberPikachu) count = 1;
            arr[index] = count;
            arr[index + 1] = count;
            index = index + 2;
            count++;
        }

        var arrayLength = arr.length
        var tempArray1 = new Array();
        for (var i = 0; i < arrayLength; i++) {
            tempArray1[i] = i;
        }

        var tempArray2 = new Array();
        for (var i = 0; i < arrayLength; i++) {
            tempArray2[i] = tempArray1.splice(Math.floor(Math.random() * tempArray1.length), 1)
        }

        var tempArray3 = new Array();
        for (var i = 0; i < arrayLength; i++) {
            tempArray3[i] = arr[tempArray2[i]];
        }

        var temp = [];
        var k = 0;
        var arr4 = new Array();
        for (var i = 0; i < this.rowMax; i++) {
            for (var j = 0; j < this.colMax; j++) {
                temp[j] = 0;
                if (i !== 0 && j !== this.colMax - 1 && i !== this.rowMax - 1 && j !== 0) {
                    temp[j] = tempArray3[k];
                    k++;
                }
            }
            arr4.push(temp);
            temp = [];
        }

        return arr4;
    },
    check: function(o, x, y) {

        if (this.currentObject == null) {
            var audio = new Audio('sound/soundSelect.mp3');
            audio.play();
            this.isSelected = true;
            this.currentObject = o;
            this.xTemp = x;
            this.yTemp = y;
            this.selected[0][0] = this.xTemp;
            this.selected[0][1] = this.yTemp;
            this.select();
        } else
        if (o != this.currentObject) {

            this.selected[1][0] = x;
            this.selected[1][1] = y;
            this.isSelected = false;

            if (this.arrMain[this.xTemp][this.yTemp] == this.arrMain[x][y]) {

                if (this.connectPikachu(this.selected[0], this.selected[1])) {

                    this.countPikachu -= 2;;
                    var audio = new Audio('sound/soundConnect.mp3');
                    audio.play();
                    this.extraTime();
                    this.arrMarked.push(this.getIndex(this.selected[0][0], this.selected[0][1]));
                    this.arrMarked.push(this.getIndex(this.selected[1][0], this.selected[1][1]))
                    this.select();
                    this.createPath();
                    this.score += 10;
                    $(".score-value").html(this.score);
                    this.arrMain[this.xTemp][this.yTemp] = 0;
                    this.arrMain[x][y] = 0;
                    this.currentObject.parentNode.removeChild(this.currentObject);
                    o.parentNode.removeChild(o);
                    this.xTemp = null;
                    this.yTemp = null;
                    this.currentObject = null;
                    this.selected[0][0] = null;
                    this.selected[0][1] = null;
                    this.selected[1][0] = null;
                    this.selected[1][1] = null;
                    setTimeout(() => this.resetPath(), 300);

                } else {

                    this.select();
                    this.xTemp = null;
                    this.yTemp = null;
                    this.selected[0][0] = null;
                    this.selected[0][1] = null;
                    this.selected[1][0] = null;
                    this.selected[1][1] = null;
                    this.currentObject = null;
                    var audio = new Audio('sound/soundMiss.mp3');
                    audio.play();

                }
            } else {

                var audio = new Audio('sound/soundMiss.mp3');
                audio.play();
                this.select();
                this.xTemp = null;
                this.yTemp = null;
                this.selected[0][0] = null;
                this.selected[0][1] = null;
                this.selected[1][0] = null;
                this.selected[1][1] = null;
                this.currentObject = null;

            }
        }
        this.checkNextLevel();
    },
    getIndex: function(x, y) {
        return x * this.colMax + y;
    },
    resetPath: function() {

        this.arrMarked = [];
        this.arrVertical = [];
        var listPikachu = document.querySelectorAll(".pikachu");
        listPikachu.forEach(index => {
            index.style.backgroundImage = "none";
        });

    },
    select: function() {

        var iii = document.querySelectorAll(".pikachu");
        for (var i = 0; i < this.rowMax; i++) {
            for (var j = 0; j < this.colMax; j++) {

                if (this.selected[0][0] == i && this.selected[0][1] == j) {
                    var index = i * this.colMax + j + 1;
                    var nn = iii[index - 1];
                    if (this.isSelected) {

                        nn.style.border = "1px solid red";
                    } else {

                        nn.style.border = "0px solid transparent";
                        nn.style.opacity = "100";
                        // this.selected[0][0] = null;
                        // this.selected[0][1] = null;
                    }

                }
                if (this.selected[1][0] == i && this.selected[1][1] == j) {

                    var index = i * this.colMax + j + 1;
                    var nn = iii[index - 1];
                    if (this.isSelected) {

                        nn.style.border = "1px solid red";
                    } else {
                        nn.style.border = "0px solid transparent";
                        nn.style.opacity = "100";
                        // this.selected[0][0] = null;
                        // this.selected[0][1] = null;
                    }
                }
            }
        }
    },

    showTime: function() {

        this.timeCount--;
        var timebar = document.getElementById("timebar");
        timebar.style.width = `${400}px`;
        var timeleft = document.getElementById("timeleft");
        timeleft.style.width = `${(timeleft.clientWidth+(400/this.time))}px`;
        $("#hint-value").html(this.numberHint);
        $("#convert-value").html(this.numberConvert);
        if (!this.timeCount) {
            this.clearTime();
            var audio = new Audio('sound/soundTimeup.mp3');
            audio.play();
            alert("Đã hết thời gian")
            this.reset();
        }

    },
    clearpikachu: function() {
        document.getElementById("pikachus").innerHTML = '';
    },
    clear: function() {
        this.clearpikachu();
        $(".score-value").html('0');
        // document.getElementById("time").innerHTML = '';
    },
    clearTime: function() {
        var timeleft = document.getElementById("timeleft");
        timeleft.style.width = 0;
        clearInterval(this.timeCountDown);
    },
    createPath: function() {
        var listPikachu = document.querySelectorAll(".pikachu");
        this.arrMarked.forEach(index => {
            listPikachu[index].style.backgroundImage = "url('img/path.png')";
        });
    },
    extraTime: function() {
        var timeleft = document.getElementById("timeleft");
        timeleft.style.width = `${(timeleft.clientWidth-(400/this.time))}px`;
        this.timeCount++;

    },
    connectPikachu: function(A, B) {
        if (A[0] > B[0]) {
            C = A;
            A = B;
            B = C;

        }
        //th1

        if (this.checkX(A[0] + 1, A[1], B[0]) && this.checkY(B[0], A[1], B[1])) {
            this.arrMarked = this.arrMarked.concat(this.arrVertical)
            return true;
        }
        this.arrMarked = [];
        this.arrVertical = [];
        //th2

        for (let j = (A[1] - 1); j >= 0; j--) {
            if (this.arrMain[A[0]][j]) break;
            this.arrMarked.push(this.getIndex(A[0], j))

            if (this.checkX((A[0]), j, B[0]) && this.checkY(B[0], j, B[1])) {
                this.arrMarked = this.arrMarked.concat(this.arrVertical)
                return true;
            }
        }
        this.arrMarked = [];
        this.arrVertical = [];
        //th3

        for (j = (A[1] + 1); j < this.colMax; j++) {
            if (this.arrMain[A[0]][j]) break;
            this.arrMarked.push(this.getIndex(A[0], j))
            if (this.checkX((A[0]), j, B[0]) && this.checkY(B[0], j, B[1])) {

                this.arrMarked = this.arrMarked.concat(this.arrVertical)
                return true;
            }
        }
        this.arrMarked = [];
        this.arrVertical = [];
        if (A[1] > B[1]) {
            C = A;
            A = B;
            B = C;
        }

        //th4

        if (this.checkY(A[0], A[1] + 1, B[1]) && this.checkX(A[0], B[1], B[0])) return true;
        //th5
        this.arrMarked = [];
        this.arrVertical = [];
        for (j = (A[0] - 1); j >= 0; j--) {
            if (this.arrMain[j][A[1]]) break;
            this.arrMarked.push(this.getIndex(j, A[1]));
            if (this.checkY(j, (A[1]), B[1]) && this.checkX(j, B[1], B[0])) {
                this.arrMarked = this.arrMarked.concat(this.arrVertical)
                return true;
            }
        }
        this.arrMarked = [];
        this.arrVertical = [];
        //th6
        for (j = (A[0] + 1); j < this.rowMax; j++) {
            if (this.arrMain[j][A[1]]) break;
            this.arrMarked.push(this.getIndex(j, A[1]));
            if (this.checkY(j, (A[1]), B[1]) && this.checkX(j, B[1], B[0])) {
                this.arrMarked = this.arrMarked.concat(this.arrVertical)
                return true;
            }
        }
        this.arrMarked = [];
        this.arrVertical = [];

    },
    checkX: function(x, y, xt) {
        for (i = x; i != xt;
            (x < xt ? i++ : i--)) {
            if (this.arrMain[i][y]) {
                this.arrVertical = [];
                return false;
            } else {
                var index = this.getIndex(i, y);
                this.arrVertical.push(index);
            }
        }
        return true;
    },

    checkY: function(x, y, yt) {
        for (i = y; i != yt;
            (y < yt ? i++ : i--)) {
            if (this.arrMain[x][i]) {
                this.arrVertical = [];
                return false;
            } else {
                var index = this.getIndex(x, i);
                this.arrVertical.push(index);
            }
        }
        return true;
    },
    convert: function() {
        if (this.numberConvert > 0) {
            var arr = [];
            for (var i = 0; i < this.rowMax; i++) {
                for (var j = 0; j < this.colMax; j++) {
                    if (this.arrMain[i][j] != 0) arr.push(this.arrMain[i][j])
                }
            }
            arr = arr.sort(() => Math.random() - 0.5)
            for (var i = 0; i < this.rowMax; i++) {
                for (var j = 0; j < this.colMax; j++) {
                    if (this.arrMain[i][j] != 0) this.arrMain[i][j] = arr.shift();
                }
            }
            this.clearpikachu();
            this.initPikachus(this.arrMain);
            this.numberConvert--;
            $("#convert-value").html(this.numberConvert);
        } else {
            alert("Đã hết lượt đổi")
        }
    },
    //bat am thanh
    sound: function(src) {
        var sound = document.getElementsByTagName("audio")[0];
        sound.src = src;
        document.body.appendChild(sound);
        sound.volume = 0.5;
        sound.play();
    },
    //tăt am thanh
    soundMute: function(src) {
        var sound = document.getElementsByTagName("audio")[0];
        sound.src = src;
        sound.volume = 0;
    },
    //chuyen man
    nextLevel: function() {
        this.level++;

        switch (this.level) {
            case 1:
                this.numeberPikachu = 7;
                this.time = 60;
                COL = 14;
                ROW = 8;
                $(".main").css('background-image', `url(img/bg${this.level}.png)`);
                break;
            case 2:
                this.numeberPikachu = 15;
                this.time = 80;
                $(".main").css('background-image', `url(img/bg${this.level}.png)`);
                break;
            case 3:
                this.numeberPikachu = 20;
                this.time = 120;
                break;
            case 4:
                this.numeberPikachu = 25;
                this.time = 200;
                COL = 16;
                ROW = 9;
                break;
            case 5:
                this.numeberPikachu = 33;
                this.time = 230;
                COL = 16;
                ROW = 9;
                break;
        }
        this.countPikachu = ROW * COL;
        this.clearpikachu();
        this.clearTime();
        this.initTime();
        this.numberHint = 3;
        this.numberConvert = 3;
        this.initPikachus(this.randomArr());
        document.getElementsByClassName("level-value")[0].innerHTML = this.level;

        var audio = new Audio('sound/soundTimeup.mp3');
        audio.play();


    },
    //kiem tra chuyen man 
    checkNextLevel: function() {
        if (this.countPikachu == 0) {
            if (this.level == 5) {
                confirm(`Chúc mừng bạn đã chiến thắng với số điểm ${this.score}`);
                this.level = 1;
                this.clearTime();
                document.getElementsByClassName("level-value")[0].innerHTML = this.level;
                COL = 14;
                ROW = 8;
                this.countPikachu = COL * ROW;
                this.reset();
            } else {
                this.nextLevel();
            }



        }

    },
    clearSelectHint: function() {
        var iii = document.querySelectorAll(".pikachu");
        for (var i = 0; i < this.rowMax; i++) {
            for (var j = 0; j < this.colMax; j++) {
                var index = i * this.colMax + j + 1;
                var nn = iii[index - 1];
                nn.style.border = "0px solid transparent";




            }
        }
    },
    selectHint: function() {

        var iii = document.querySelectorAll(".pikachu");
        for (var i = 0; i < this.rowMax; i++) {
            for (var j = 0; j < this.colMax; j++) {
                if (this.selectedHint[0][0] == i && this.selectedHint[0][1] == j) {
                    var index = i * this.colMax + j + 1;
                    var nn = iii[index - 1];
                    nn.style.border = "3px solid red";
                }
                if (this.selectedHint[1][0] == i && this.selectedHint[1][1] == j) {
                    var index = i * this.colMax + j + 1;
                    var nn = iii[index - 1];
                    nn.style.border = "3px solid red";
                }
            }
        }

    },
    checkHint: function(o, x, y) {


        var isConnect = false;
        if (this.currentObjectHint == null) {
            this.currentObjectHint = o;
            this.xTempHint = x;
            this.yTempHint = y;
            this.selectedHint[0][0] = x;
            this.selectedHint[0][1] = y;
            this.selectHint();
        } else
        if (o != this.currentObjectHint) {
            this.selectedHint[1][0] = x;
            this.selectedHint[1][1] = y;
            if (this.arrMain[this.xTempHint][this.yTempHint] == this.arrMain[x][y]) {
                if (this.connectPikachu(this.selectedHint[0], this.selectedHint[1])) {
                    isConnect = true;
                    this.selectHint();
                } else {
                    this.isSelected = false;
                    this.clearSelectHint();
                }
            } else {
                this.isSelected = false;
                this.clearSelectHint();
            }
        }

        return isConnect;
    },
    hint: function() {
        if (this.numberHint > 0) {
            this.xTemp = null;
            this.yTemp = null;
            this.currentObject = null;
            A: for (var i = 0; i < this.rowMax; i++) {
                for (var j = 0; j < this.colMax; j++) {
                    var td = document.querySelectorAll(".pikachu")[i * this.colMax + j];
                    var img = td.querySelectorAll('img')[0];
                    if (this.arrMain[i][j] != 0) {
                        this.clearSelectHint();
                        this.checkHint(img, i, j);
                        for (var k = 0; k < this.rowMax; k++) {
                            for (var h = 0; h < this.colMax; h++) {
                                if (this.arrMain[k][h] != 0) {
                                    var td1 = document.querySelectorAll(".pikachu")[k * this.colMax + h];
                                    var img1 = td1.querySelectorAll('img')[0];

                                    if (i != k || j != h) {

                                        if (this.checkHint(img1, k, h)) {
                                            this.numberHint--;
                                            $("#hint-value").html(this.numberHint);
                                            break A;
                                        }
                                    }
                                }
                            }
                        }
                        this.selectedHint[0][0] = null;
                        this.selectedHint[0][1] = null;
                        this.selectedHint[1][0] = null;
                        this.selectedHint[1][1] = null;
                        this.currentObjectHint = null;
                        this.isSelected = true;
                    }


                }
            }
        } else {
            alert("Đã hết lượt sử dụng gợi ý!");
        }
    }
}
game.start();

function reset() {
    game.reset();
}

function check(o, x, y) {

    game.check(o, x, y);
}

function sound() {
    var soundImage = document.getElementById('sound');

    if (soundImage.alt == 'mute') {
        game.sound("sound/sound-background-1.mp3");
        soundImage.alt = 'active';
        soundImage.src = "img/volume-active.png";
    } else {
        game.soundMute("sound/sound-background-1.mp3");
        soundImage.alt = 'mute'
        soundImage.src = "img/volume.png";
    }
}

function convert() {
    game.convert();
}

function nextLevel() {
    game.nextLevel();
}

function hint() {


    game.hint();
}
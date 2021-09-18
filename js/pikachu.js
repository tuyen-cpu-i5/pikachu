var pikachu = function(game, row, col, value) {
    this.game = game;
    this.divPikachu = null;
    this.value = value;
    this.isSelected = null;
    this.init();
    this.row = row;
    this.col = col;


}
pikachu.prototype = {
    init: function() {

        if (this.value != 0) {
            this.divPikachu = document.createElement("td");
            this.divPikachu.className = "pikachu";
            var img = document.createElement("img");
            img.src = "img/a" + this.value + ".png";

            this.divPikachu.appendChild(img);
            img.setAttribute("onclick", `check(this, ${this.row}, ${this.col})`)
        } else {
            this.divPikachu = document.createElement("td");
            this.divPikachu.className = "pikachu";
        }
        this.hoverPikachu();

    },
    selected: function() {
        this.isSelected = this.isSelected ? true : false;
    },
    hoverPikachu: function() {
        $(document).ready(function() {
            $(".pikachu").hover(function() {
                    $(this).css("opacity", "0.5");
                }, function() {
                    $(this).css("opacity", "2");
                }

            );
        });

    }

}
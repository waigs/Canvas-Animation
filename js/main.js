Fishes = function() {
    if(!$) return;
    this.fish_width = 35;
    this.fish_height = 20;
    this.fishes_count = 15;
    this.fishes_top = 283;

    $("#fishes").css({ top: this.fishes_top});

    var canvas = $("#fishes")[0];
    canvas.width = 325;
    canvas.height = 427;

    this.ctx = canvas.getContext("2d");
    if(!this.ctx) return;

    this.loadSprites([
        "water.png",
        "water_bg.png",
        "wave.png",
        "fish.png"
    ]);
   
    this.scroll();
}


Fishes.prototype = {

    loadSprites: function(images) {
        this.sprites = [];

        var counter = images.length;
        for(var i=0; i<images.length; i++) {
            $(new Image()).attr("sprite_name", images[i]).attr('src', "images/" + images[i]).load(function(e) {
                var name = $(e.target).attr("sprite_name").split(".");
                fishes.sprites[name[0]] = e.target;

                if(--counter < 1) {
                    fishes.start();
                }
            });
        }
    },


    start: function() {
        $(window).on("scroll", this.scroll.bind(this));
        $(window).on("resize", this.scroll.bind(this));

        this.wave_ofs = 0;
        this.a = 0;

        this.fishes = [];
        for(var i=0; i<this.fishes_count; i++) {
            this.fishes[i] = this.getRandomFish(true);
        }
        this.fish_dy = [];
        for(var i=0; i<100; i++) {
            this.fish_dy[i] = Math.sin(Math.PI * i/50);
        }
        setInterval(this.animate.bind(this), 20);
    },


    animate: function() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        
        this.animateWave();
        this.animateWater();
        this.animateFishes();
    },


    animateWave: function() {
        this.ctx.drawImage(this.sprites.wave, 
            this.wave_ofs,
            0, 
            this.ctx.canvas.width, 
            this.sprites.wave.height,
            0,
            0,
            this.ctx.canvas.width,
            this.sprites.wave.height
        );
        if(++this.wave_ofs > 19) this.wave_ofs = 0;
    },



    animateWater: function() {
        this.ctx.drawImage(this.sprites.water_bg, 
            0, 
            this.sprites.wave.height, 
            this.ctx.canvas.width, 
            this.ctx.canvas.height
        );

        var water_dx1 = 50 * (1 + Math.sin(this.a)),
            water_dy1 = 50 * (1 + Math.cos(this.a)),
            water_dx2 = 50 * (1 + Math.cos(-this.a * 0.9 + 3)),
            water_dy2 = 50 * (1 + Math.sin(-this.a * 0.9 + 3));
        this.a += 0.02;


        this.ctx.drawImage(this.sprites.water, 
            water_dx1, 
            water_dy1, 
            this.sprites.water.width - water_dx1, 
            this.ctx.canvas.height - water_dy1,
            0, 
            this.sprites.wave.height, 
            this.ctx.canvas.width, 
            this.ctx.canvas.height - this.sprites.wave.height
        );


        this.ctx.drawImage(this.sprites.water, 
            water_dx2, 
            water_dy2, 
            this.ctx.canvas.width - water_dx2, 
            this.ctx.canvas.height - water_dy2,
            0, 
            this.sprites.wave.height, 
            this.ctx.canvas.width, 
            this.ctx.canvas.height - this.sprites.wave.height
        );
    },



    animateFishes: function() {
        var f;
        for(var i=0; i<this.fishes.length; i++) {
            if(this.fishes[i].x < -this.fish_width || this.fishes[i].x > this.ctx.canvas.width) {
                this.fishes[i] = this.getRandomFish();
            }

            f = this.fishes[i];
            f.x += f.dx;
            f.dy_idx++;

            this.ctx.drawImage(this.sprites.fish, 
                f.sprite_dx, 
                f.sprite_dy, 
                this.fish_width, 
                this.fish_height,
                f.x, 
                f.y + f.dy_k * this.fish_dy[f.dy_idx % this.fish_dy.length],
                this.fish_width, 
                this.fish_height
            );                
        }
    },


    getRandomFish: function(is_init) {
        var res = {
            y: this.sprites.wave.height + Math.random() * (this.ctx.canvas.height - this.sprites.wave.height - this.fish_height),
            x: -this.fish_width,
            dx: 0.5 + Math.random(),
            dy_idx: 0,
            dy_k: Math.random() * 5,
            sprite_dy: this.fish_height * Math.floor(Math.random() * 8)
        }

        if(Math.random() > 0.5) {
            res.x = - this.fish_width;
            res.dx = 0.5 + Math.random();
            res.sprite_dx = 0;
        } else {
            res.x = this.ctx.canvas.width;
            res.dx = - (0.5 + Math.random());
            res.sprite_dx = this.fish_width;
        }

        if(is_init) {
            res.x = Math.random() * (this.ctx.canvas.width - this.fish_width);
        }

        return res;
    },


    // scroll: function(e) {
    //     var top = this.fishes_top;

    //     var ofs = $(document).scrollTop() + $(window).height() - $("#tank").offset().top - $("#tank").height();
    //     if(ofs > 0) {
    //         top = Math.max(100, this.fishes_top - ofs);
    //     }

    //     $("#fishes").css({ top: top});
    // }
    scroll: function(e) {
        if($("#tank").offset().top < $(window).height()) {
            var ofs = this.fishes_top - $(document).scrollTop();
        } else {
            var ofs = $("#tank").offset().top - $(document).scrollTop();
        }

        var top = Math.max(70, ofs);
        top = Math.min(top, this.fishes_top);

        if(top != this.fishes_top) {
            $("#fishes").css({ top: top});
        }
    }
}

$(document).ready(function(){
    fishes = new Fishes();
}); 


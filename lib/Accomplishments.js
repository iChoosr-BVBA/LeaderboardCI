﻿ function accomplishment (streak,user, points) {
    if (streak >= 5 && streak <10) {
        if (streak == 5) {
            user.addPoints(4);
        }
        return {text: "you're on fire" ,image:"/img/fire.gif"};
    }
    if (streak >= 10 && streak < 15) {
        if (streak == 10) {
            user.addPoints(6);
        }
        return { text: "you're killing it",image:"/img/fire.gif" ,badge:"/img/killit.gif"};
    }
    if (streak >= 15 && streak < 20) {
        if (streak == 15) {
            user.addPoints(2);
        }
        return { text: "who's your daddy",image:"/img/empty.png" ,badge:"/img/daddy.jpg"};
    }
    if (streak >= 25 && streak < 30) {
        return { text: "Laika boss",image:"/img/empty.png" ,badge:"/img/laikaBoss.jpg"};
    }
    if (streak == 50 ) {
        user.addPoints(2);
        return { text: "Terminator",image:"/img/empty.png" ,badge:"/img/empty.png", audio:"terminator"};
    }
    if (60 > streak >50){
        return { text: "Terminator",image:"/img/empty.png" ,badge:"/img/empty.png"};
    }
    if (streak >= 60) {
        return { text: "Ultimate PS'er",image:"/img/empty.png" ,badge:"/img/ps.png"};        
    }
};

module.exports = accomplishment;
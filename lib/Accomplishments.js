 function accomplishment (streak,user) {
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
};


    // export the class
module.exports = accomplishment;
function sleep(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(x);
            resolve();
        }, x * 1000)
    });
}


// for (let i = 0; i++; i < 3) {
//     (async () => {
//         await sleep(i + 1)
//     })();
// }


[0, 1, 2].forEach(async (el, i) => {
    await sleep(3 - i);
});

console.log('rua');


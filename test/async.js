function waitSocket() {
    return new Promise((resolve, reject) => {
        resolve(250);
    });
}
let socketid = (async () => {
    return await waitSocket();
})();

console.log(socketid);
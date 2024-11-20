'use strict';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.querySelector('.form').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    const delay = Number(form.delay.value);
    const state = form.state.value;
    createPromise(delay, state)
        .then(delay => {
            iziToast.success({
                title: '✅ Fulfilled',
                message: `Fulfilled promise in ${delay}ms`,
                position: 'topRight',
            });
        })
        .catch(delay => {
            iziToast.error({
                title: '❌ Rejected',
                message: `Rejected promise in ${delay}ms`,
                position: 'topRight',
            });
        });
});

function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}

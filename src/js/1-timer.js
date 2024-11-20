'use strict';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const elements = {
    inputEl: document.getElementById('datetime-picker'),
    showDays: document.querySelector('span[data-days]'),
    showHours: document.querySelector('span[data-hours]'),
    showMinutes: document.querySelector('span[data-minutes]'),
    showSeconds: document.querySelector('span[data-seconds]'),
    startBtn: document.querySelector('button[data-start]'),
};

let userSelectedDate = null;
let interval;

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}


function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}


const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];


        if (userSelectedDate && userSelectedDate > new Date()) {
            elements.startBtn.disabled = false;
        } else {
            elements.startBtn.disabled = true;
            iziToast.error({
                title: 'Error',
                message: "Please choose a date in the future",
            });
        }
    },
};

document.addEventListener('DOMContentLoaded', function () {

    flatpickr(elements.inputEl, options);


    elements.startBtn.addEventListener('click', function () {

        if (!userSelectedDate || userSelectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: "Please choose a future date",
            });
            return;
        }


        elements.inputEl.disabled = true;
        elements.startBtn.disabled = true;

        const targetDate = userSelectedDate.getTime();

        interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeDifference = targetDate - currentTime;


            if (timeDifference <= 0) {
                clearInterval(interval);
                elements.showDays.textContent = '00';
                elements.showHours.textContent = '00';
                elements.showMinutes.textContent = '00';
                elements.showSeconds.textContent = '00';
                iziToast.success({
                    title: 'Done',
                    message: "Time's up!",
                });


                elements.inputEl.disabled = false;
                elements.startBtn.disabled = true;
                interval = null;
                return;
            }


            const { days, hours, minutes, seconds } = convertMs(timeDifference);


            elements.showDays.textContent = addLeadingZero(days);
            elements.showHours.textContent = addLeadingZero(hours);
            elements.showMinutes.textContent = addLeadingZero(minutes);
            elements.showSeconds.textContent = addLeadingZero(seconds);
        }, 1000);
    });
});

// ==UserScript==
// @name         [Functional] Copy Phone Number
// @namespace    http://tampermonkey.net/
// @author       You
// @match        https://vceccefinlpa002.amerco.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uhaul.net
// @grant        none
// ==/UserScript==
let PhoneBookLastOpen = false;

function isPhoneOpen() {
    const targetElement = document.querySelector('#content-area-parent');

    if (targetElement) {
        PhoneBookLastOpen = true;
        return true;
    } else {
        PhoneBookLastOpen = false;
        return false;
    }
}

// Function to copy the text to the clipboard
function copyToClipboard(text) {
    var tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

function formatPhoneNumber(phoneNumber, forCopy) {
    let countryCode = '';
    let mainNumber = '';

    if (phoneNumber.startsWith('+91')) {
        countryCode = '+91';
        mainNumber = phoneNumber.slice(3);
    } else if (phoneNumber.startsWith('+1')) {
        countryCode = '+1';
        mainNumber = phoneNumber.slice(2);
    } else if (phoneNumber.startsWith('1')) {
        countryCode = '+1';
        mainNumber = phoneNumber.slice(1);
    } else if (phoneNumber.startsWith('91')) {
        countryCode = '+91';
        mainNumber = phoneNumber.slice(2);
    } else if (phoneNumber.length === 6) {
        mainNumber = phoneNumber;
    } else {
        countryCode = ' ';
        mainNumber = phoneNumber;
    }

    let formattedNumber = '';

    if (!forCopy) {
        formattedNumber = countryCode
            ? `${countryCode} (${mainNumber.slice(0, 3)}) ${mainNumber.slice(3, 6)}-${mainNumber.slice(6)}`
            : `${mainNumber.slice(0, 3)}-${mainNumber.slice(3)}`;
    } else {
        formattedNumber = countryCode
            ? `(${mainNumber.slice(0, 3)}) ${mainNumber.slice(3, 6)}-${mainNumber.slice(6)}`
            : (mainNumber.length === 6 ? `${mainNumber.slice(0, 3)}${mainNumber.slice(3)}` : mainNumber); // Added condition for 6 digits number
    }

    return formattedNumber.trim();
}

function updatePhoneNumberElement(element, formattedPhoneNumber) {
    element.textContent = formattedPhoneNumber;
}

function clickHandler(event, phoneNumber) {
    event.stopPropagation();
    copyToClipboard(formatPhoneNumber(phoneNumber, true));
}

function RunPhoneOpen() {
    if (PhoneBookLastOpen === true) {
        var elements = document.querySelectorAll('[id^="call-control-participant-"]');

        for (var i = 0; i < elements.length; i++) {
            let element = elements[i];

            // Check if the copy button is already added for the element
            if (!element.hasAttribute('data-copy-button')) {
                element.setAttribute('data-copy-button', 'true');

                // Get the phone number from the element
                let phoneNumber = element.textContent.trim();

                // Format the phone number for on-page display
                var formattedPhoneNumber = formatPhoneNumber(phoneNumber, false);

                // Update the phone number element with the formatted phone number
                updatePhoneNumberElement(element, formattedPhoneNumber);

                // Create a container div for the element and button
                var container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';

                // Append the container to the parent of the element
                element.parentNode.insertBefore(container, element);

                // Move the element inside the container
                container.appendChild(element);

                // Create a square button
                var button = document.createElement('button');
                button.style.width = '16px';
                button.style.height = '16px';
                button.style.backgroundImage = 'url(https://simg.nicepng.com/png/small/439-4398786_copy-link-icon-copy-link-icon-png.png)';
                button.style.backgroundSize = 'cover';
                button.style.border = 'none';
                button.style.cursor = 'pointer';
                button.style.marginLeft = '5px';

                // Add click event listener to the button
                button.addEventListener('click', (event) => clickHandler(event, phoneNumber));

                // Append the button to the container
                container.appendChild(button);
            }
        }
    }
}

// Function to continuously check
function isPhoneVisibleCheck() {
    setInterval(() => {
        if (isPhoneOpen()) {
            RunPhoneOpen();
        }
    }, 100);
}

isPhoneVisibleCheck();

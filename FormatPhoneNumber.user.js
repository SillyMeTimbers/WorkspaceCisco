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
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function formatPhoneNumber(phoneNumber, isOutsourced) {
    if (isOutsourced) {
        var phoneNumberWithoutCountryCode = phoneNumber.slice(2);
        return `+1 (${phoneNumberWithoutCountryCode.slice(0, 3)}) ${phoneNumberWithoutCountryCode.slice(3, 6)}-${phoneNumberWithoutCountryCode.slice(6)}`;
    } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }
}

function updatePhoneNumberElement(element, formattedPhoneNumber) {
    element.textContent = formattedPhoneNumber;
}

function RunPhoneOpen() {
    if (PhoneBookLastOpen === true) {
        var elements = document.querySelectorAll('[id^="call-control-participant-"]');

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];

            // Check if the copy button is already added for the element
            if (!element.hasAttribute('data-copy-button')) {
                element.setAttribute('data-copy-button', 'true');

                // Get the phone number from the element
                var phoneNumber = element.textContent.trim();

                // Determine if the number is outsourced or internal
                var isOutsourced = phoneNumber.startsWith('+1');

                // Format the phone number
                var formattedPhoneNumber = formatPhoneNumber(phoneNumber, isOutsourced);

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
                button.addEventListener('click', function(event) {
                    event.stopPropagation();
                    var phoneNumberWithoutCountryCode = phoneNumber.slice(2);
                    var textContent = isOutsourced ? phoneNumberWithoutCountryCode : phoneNumber;
                    copyToClipboard(textContent);
                });

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

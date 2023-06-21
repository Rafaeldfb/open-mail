// CONSTANTS
const BASE_URL = true ? '' : '127.0.0.1:8000' // by requirements, i cant use other file. so isn't possible to do some import dotenv stuff and so it will be hard coded here.

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

//  SEND EMAIL        **** START
function send_mail(event) {
  event.preventDefault();

  const requestUrl = `${BASE_URL}/emails`;

  const mailData = {
    origin: event.target.elements.origin?.value ?? "",
    recipients: event.target.elements.recipients?.value ?? "",
    subject: event.target.elements.subject?.value ?? "",
    body: event.target.elements.body?.value ?? "",
  }

  return make_request(requestUrl, mailData, 'post', sent_mail_callback);
}

function sent_mail_callback(response) {
  const message = response?.message ?? '';
  if (!message) return null;

  return display_message(message);
}
//  SEND EMAIL        **** END

// AJAX FECTH HELPER
async function make_request(url, requestData, requestMethod, callback=null) {
  const request = await fetch(
    url, 
    {
      method: requestMethod,
      body: JSON.stringify(requestData),
    }
  )
    .then(response => { if (response.ok || response.status === 200) return response.json() })

    .then(result => { if(!!callback && callback instanceof Function) return callback(result) })

    .catch(err => console.error(`Error: request failed to - ${url}. /\n caused by: ${err}.`))
    
  return true
}

// Messages - 
const messageContainerElement = document.querySelector('#messagesConteiner');
const messageWrapper = messageContainerElement.querySelector('#toastWrapper');
const messageToast = messageWrapper.querySelector('.toast');

function display_message(message) {
  if (typeof message != 'string'|| !message.trim().length ) return false;

  const messageToastInstance = bootstrap.Toast.getOrCreateInstance(messageToast);

  messageToast.querySelector('#messageContent').innerHTML = message.trim();
  console.log("display_message", messageToast);

  messageToastInstance.show()

  return true;
}
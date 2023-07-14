// CONSTANTS
const BASE_URL = true ? '' : '127.0.0.1:8000'; // by requirements, i cant use other file. 
//so isn't possible to do some import dotenv stuff and so it will be hard coded here.

/**
 * SetState for activeMailBox
 */
const mailBoxState = document.querySelector('input[name="activeMailBox"');

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
  mailBoxState.value = mailbox

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#mailboxTitle').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Clear all previus content
  document.querySelector("#listBoxContent").innerHTML = ''

  // Implematention of related content load
  return loader_handler(mailbox);
}

function loader_handler(mailbox) {
  const mailboxes = ['inbox', 'sent', 'archive'];

  if (!mailboxes.includes(mailbox)) return null;

  const requestUrl = `emails/${mailbox}`;

  return make_request(
    requestUrl, 
    null, 
    'get', 
    (response) => mailbox_loader_callback(response, mailbox)
  );
}

function mailbox_loader_callback(response, mailbox) {
  // If the response is empty, show an emptyness message
  const emptyWarningElement = document.querySelector('#emptyBoxContent');

  if (!response.length) return emptyWarningElement.classList.replace('d-none', 'd-block');

  emptyWarningElement.classList.replace('d-block', 'd-none')
  const template = document.querySelector('#emailListItemTemplate');

  response.forEach(function(mailObjc, index, arr, arg=template) {
    return mailListItemBuilder(mailObjc, template);
  })

  return true;
}

function mailListItemBuilder(mailObject, templateElement) {
  const mailItemData = {
    id: mailObject.id,
    sender: mailObject.sender,
    recipients: [...mailObject.recipients],
    subject: mailObject.subject,
    body: mailObject.body,
    timestamp: formatTimestamp(mailObject.timestamp),
    read:  mailBoxState.value === 'sent' ? false : mailObject.read,
    archived: mailObject.archived,
  }

  const emailItemClone = templateElement.content.cloneNode(true).firstElementChild;

  // Fill all data from this email in the template
  emailItemClone.dataset.mailId = mailItemData.id;
  emailItemClone.dataset.mailStatus = mailItemData.read;

  mailItemData.read 
    ? emailItemClone.classList.add('text-bg-secondary') 
    : emailItemClone.classList.add('text-bg-light');

  emailItemClone.querySelector('[data-mail-sender]').textContent = mailItemData.sender;
  emailItemClone.querySelector('[data-mail-subject]').textContent =  mailItemData.subject;
  emailItemClone.querySelector('[data-mail-timestamp]').textContent = mailItemData.timestamp;
  
  document.querySelector("#listBoxContent").appendChild(emailItemClone);

  return null;
}

function openMail(e, mailId) {
  const mailListItem = document.querySelector(`[data-mail-id="${mailId}"]`);

  mailListItem.classList.add('text-bg-secondary');
  console.log(mailId);

  return make_request(`emails/${mailId}`, null,'get', loaderMail);
}

function loaderMail(request) {
  const emailModalElement = document.getElementById('ajaxEmailModal');
  const emailModal = bootstrap.Modal.getOrCreateInstance(emailModalElement);

  emailModalData(request, emailModalElement);

  return emailModal.show();
}

function emailModalData(data, emailModalElement) {
  console.log('data from request: ', data);

  const buttonArchiveMail = emailModalElement.querySelector('.mail-archived');

  emailModalElement.querySelector('.mail-subject').innerText = data.subject;
  emailModalElement.querySelector('.mail-sender').innerText = data.sender;
  emailModalElement.querySelector('.mail-recipients').innerText = data.recipients;
  emailModalElement.querySelector('.mail-body').innerText = data.body;
  emailModalElement.querySelector('.mail-timestamp').innerText = data.timestamp;
  buttonArchiveMail.innerText = data.archived ? 'unarchive' : 'archive';
  buttonArchiveMail.dataset.mailArchived = data.archived;
  buttonArchiveMail.dataset.mailId = data.id;

  buttonArchiveMail.classList.remove('d-none')
  if (mailBoxState.value === 'sent') buttonArchiveMail.classList.add('d-none')

  return make_request(`emails/${data.id}`, {read: true}, 'put');
}

function mailArchiveRequestHandler(e, mailId, mailArchived) {
  const emailModalElement = document.querySelector('#ajaxEmailModal');
  let = newArchivedStatus = !JSON.parse(mailArchived);

  emailModalElement.querySelector('.mail-archived').innerText = newArchivedStatus ? 'unarchive' : 'archive';
  emailModalElement.querySelector('.mail-archived').dataset.mailArchived = newArchivedStatus;
  
  const modalIntance = bootstrap.Modal.getInstance(emailModalElement);

  make_request(
    `emails/${mailId}`, 
    {archived: newArchivedStatus}, 
    'PUT',
    () => {
      load_mailbox('inbox');
      modalIntance.toggle()
    }
  );

  return null;
}

//          SEND EMAIL        **** START
/**
 * Called at compose email form's submit event - It handle submission of email data and a callback to the fecth handler.
 * @param {event} event - Tthe event triggered by form submission.
 * @returns {function} - calls the request handles with data and callback as args.
 */
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

/**
 * A callback to run after a successfull request. Responsible to trigger all UI changes.
 * @param {object} response  the parsed response body, got after the fetch promise got fullfilled
 * @returns {boolean} - False means invalid response / message.
 */
function sent_mail_callback(response) {
  const message = response?.message ?? '';
  if (!message) return false;

  load_mailbox('sent');
  display_message(message);

  return true;
}
//        SEND EMAIL        **** END


//        AJAX FECTH HELPER
/**
 * AJAX HANDLER - receives as paramitters the arguments to do a Fetch request.
 * @param {string} url - the route as string to address the request.
 * @param {object} requestData - the data to serialyze and send with the request.
 * @param {string} requestMethod - the http verb of request.
 * @param {function} callback - (Optional) A callback that receives the parsed request body.
 * @returns {boolean}
 */
async function make_request(url, requestData=null, requestMethod, callback=null) {
  const fetchConfig = requestMethod.toLowerCase() === 'get' 
    ? { method: requestMethod }
    : { method: requestMethod, body: JSON.stringify(requestData) }

  const request = await fetch(
    url, 
    fetchConfig,
  )
    .then(response => { 
      // When a put request was successfull but has no content within response
      if (response.status === 204) return true;
      if (response.ok || response.status === 200) return response.json();
    })

    .then(result => { if(!!callback && callback instanceof Function) return callback(result) })

    .catch(err => console.error(`Error: request failed to - ${url}. \n caused by: ${err}.`))
    
  return true
}


//        Messages 
const messageContainerElement = document.querySelector('#messagesConteiner');
const messageWrapper = messageContainerElement.querySelector('#toastWrapper');
const messageToast = messageWrapper.querySelector('.toast');

/**
 * Display a message using Bootstrap toast
 * @param {string} message - The message to display inside of the Toast body.
 * @returns {boolean}
 */
function display_message(message) {
  if (typeof message != 'string'|| !message.trim().length ) return false;

  const messageToastInstance = bootstrap.Toast.getOrCreateInstance(messageToast);

  messageToast.querySelector('#messageContent').innerHTML = message.trim();

  messageToastInstance.show();

  return true;
}

// Helpers
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
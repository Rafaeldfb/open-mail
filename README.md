# open-mail
A Client side interface for an email plattaform, based in CS50 web third project.

Back-end - Django;
Front-end - Js vanilla, Sass, ViteJs and Bootstrap v5.3.

## Instalation: (using bash/zshel terminal)

Using venv - make your env for python 3.8 and activate it;
to run the env open the root folder at your terminal and run : 
```$ source ./env/bin/activate```

Now use pip to match the python's packages requirement:
```pip install -r requirements.txt```

Install all node dependencies:
```$ npm i```

Copy and rename the model.env to .env and fill it with your configurations:
```$ cp ./model.env ./.env```

## How to run Locally (development)
At the root directory you should run a server for Django's backend and another for Vite's assets server as folllows
### back-end:
'$ python3 manage.py runserver'
### front-end:
'npm run dev'

### LocalHost address:
The localhost addres and port that will grant acess to the project will be prompted by the front-end command script ('npm run dev').
Just click at the link with pressed ctrl (or cmd) buttom or just copy and paste it at your browser.


# Specifications List:

Using JavaScript, HTML, and CSS, complete the implementation of your single-page-app email client inside of inbox.js (and not additional or other files; for grading purposes, we’re only going to be considering inbox.js!). You must fulfill the following requirements:

## Send Mail
- [X] When a user submits the email composition form, add JavaScript code to actually send the email.
    - [X]  You’ll likely want to make a POST request to `/emails`, passing in values for recipients, subject, and body.
    - [X]  Once the email has been sent, load the user’s sent mailbox.

## Mailbox
- [X] When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
    - [X] You’ll likely want to make a GET request to `/emails/<mailbox>` to request the emails for a particular mailbox.
    - [X] When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
    - [X] When a mailbox is visited, the name of the mailbox should appear at the top of the page (this part is done for you).
    - [X] Each email should then be rendered in its own box (e.g. as a `<div>` with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
    - [X] If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.

## View Email
- [X] When a user clicks on an email, the user should be taken to a view where they see the content of that email.
    - [X] You’ll likely want to make a GET request to `/emails/<email_id>` to request the email.
    - [X] Your application should show the email’s sender, recipients, subject, timestamp, and body.
    - [X] You’ll likely want to add an additional `<div>` to `inbox.html` (in addition to `emails-view` and `compose-view`) for displaying the email. Be sure to update your code to hide and show the right views when navigation options are clicked.
    - [x] See the hint in the Hints section about how to add an event listener to an HTML element that you’ve added to the DOM.
    - [x] Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to `/emails/<email_id>` to update whether an email is read or not.

## Archive and Unarchive
- [X] Allow users to archive and unarchive emails that they have received.
    - [X] When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
    - [X] Recall that you can send a PUT request to `/emails/<email_id>` to mark an email as archived or unarchived.
    - [X] Once an email has been archived or unarchived, load the user’s inbox.

## Reply
- [X] Allow users to reply to an email.
    - [X] When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
    - [X] When the user clicks the “Reply” button, they should be taken to the email composition form.
    - [X] Pre-fill the composition form with the recipient field set to whoever sent the original email.
    - [X] Pre-fill the subject line. If the original email had a subject line of `foo`, the new subject line should be `Re: foo`. (If the subject line already begins with `Re:`, no need to add it again.)
    - [X] Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:" followed by the original text of the email.

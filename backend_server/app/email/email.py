from app import mail
from flask import jsonify, render_template, current_app
from flask_mail import Message
from app.decorators import async_mail
from threading import Thread
from email.message import EmailMessage

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_password_reset(token, recipients, callback):
    msg = Message('Password Reset',
                  recipients=recipients)

    url = f'{callback}/{token}?email={recipients[0]}'
    msg.html = render_template('password_reset.html', url=url)

    Thread(target=send_async_email,
            args=(current_app._get_current_object(), msg)).start()


def send_registration(token, recipients, callback):
    msg = Message('Registration email',
                  recipients=recipients)

    url = f'{callback}/{token}?email={recipients[0]}'
    msg.html = render_template('registration.html', url=url)

    Thread(target=send_async_email,
            args=(current_app._get_current_object(), msg)).start()

def recieved_email_template(client, project):
    msg = EmailMessage()
    msg['To'] = client.notification_email
    msg.add_header('Content-Type', 'text/html')
    msg.add_header('X-Unsent', '1')
    html = render_template('job_recieved.html', client_name=client.company,
            project_name = project.project_name, project_id = project.id, 
            url=current_app.config['WEBSITE_URL'])
    msg.set_payload(html)
    return msg

def submitted_email_template(client, project):
    msg = EmailMessage()
    msg['To'] = client.notification_email
    msg.add_header('Content-Type', 'text/html')
    msg.add_header('X-Unsent', '1')
    html = render_template('job_submitted.html', client_name=client.company,
            project_name = project.project_name, url=current_app.config['WEBSITE_URL'])
    msg.set_payload(html)
    return msg

def completed_email_template(client, project):
    msg = EmailMessage()
    msg['To'] = client.notification_email
    msg.add_header('Content-Type', 'text/html')
    msg.add_header('X-Unsent', '1')
    html = render_template('job_completed.html', client_name=client.company,
            project_name = project.project_name, url=current_app.config['WEBSITE_URL'])
    msg.set_payload(html)
    return msg

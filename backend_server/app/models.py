from app import db
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from jwt import encode
from flask import current_app

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(320), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    client_id = db.Column(db.Integer, nullable=False)
    notifications = db.Column(db.Boolean, nullable=False, default=True)
    token = db.Column(db.Text) # We maybe dont need this

    def __repr__(self):
        return f'<User {self.id}>'

    # set password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # check password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_token(self, expires_in=24):
        exp_time = datetime.utcnow() + timedelta(hours=expires_in)
        token = encode({'id': self.id,
                        'exp':exp_time},
                        self.password_hash)
        return token

    def to_dict(self):
        return { 'id': self.id,
                 'email': self.email,
                 'admin': self.admin,
                 'client_id': self.client_id }

    def from_dict(self, data, new_user=False):
        for field in ['email']:
            if field in data:
                setattr(self, field, data[field])
        if new_user and 'password' in data:
            self.set_password(data['password'])

    def is_admin(self):
        return self.admin

class Client(db.Model):
    __tablename__ = 'clients'
    id = db.Column('idClient', db.Integer, primary_key=True)
    company = db.Column('Company', db.String(45))
    address = db.Column('Address', db.String(200))
    address2 = db.Column('Address2', db.String(200))
    abn = db.Column('ABN', db.String(45))
    phone = db.Column('Phone', db.String(200))
    notification_email = db.Column('NotificationEmail', db.String(300))
    encrypt = db.Column('encrypt', db.String(45))
    owner = db.Column('owner', db.Integer)
    client_app_id = db.Column('idClientApp', db.Integer)

    def to_dict(self):
        return { 'company': self.company,
                 'address': self.address,
                 'address2': self.address2,
                 'abn': self.abn,
                 'phone': self.phone,
                 'email': self.notification_email,
                 'client_app_id': self.client_app_id }

    def to_dict_minimal(self):
        return {'id':self.id,
                'company':self.company,
                'email': self.notification_email}

    def __repr__(self):
        return f"<Client {self.id}>"

class Coc(db.Model):
    __tablename__ = 'coc'
    ed = db.Column('ED', db.Integer, primary_key=True)
    project_fk = db.Column('projectFk', db.Integer)
    field_id = db.Column('Field ID', db.String(200), nullable=False)
    collection_date = db.Column('Collection Date', db.DateTime, nullable=False)
    sample_type = db.Column('Type', db.String(100))
    comment = db.Column('Comment', db.String(200))
    received_date = db.Column('Received Date', db.DateTime, nullable=False)
    sub_project = db.Column('SubProject', db.String(45))

    def to_dict(self):
        recieved_date_temp = "None" if self.received_date is None else self.received_date.date().isoformat()
        collection_date_temp = "None" if self.collection_date is None else self.collection_date.date().isoformat()
        return { 'ed_number': self.ed,
                 'sample_type': self.sample_type,
                 'comment': self.comment,
                 'collection_date': collection_date_temp,
                 'received_date':  recieved_date_temp,
                 'sub_project': self.sub_project}

    def __repr__(self):
        return f"<Coc {self.ed}>"


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column('idprojects', db.Integer, primary_key=True, nullable=False)
    client_fk = db.Column('idClientFk', db.Integer, nullable=False)
    project_name = db.Column('project_name', db.String(45))
    project_comment = db.Column('projectComment', db.String(200))
    project_status = db.Column('projectstatus', db.String(45))
    actioned = db.Column('actioned', db.String(45))
    report_link = db.Column('reportlink', db.String(150))
    invoiced = db.Column('invoiced', db.Boolean, default=False)
    invoiced_date = db.Column('invoicedDate', db.DateTime)
    status_date = db.Column('statusDate', db.DateTime)
    active = db.Column('active', db.Boolean, default=False)
    notifications_sent = db.Column('notifications_sent', db.Integer, default=0)

    def to_dict_minimal(self):
        date_modified_temp = None if self.status_date is None else self.status_date.date().isoformat()
        emails = {}
        emails['recieved']  = bool(self.notifications_sent & 0b001)
        emails['lodged']    = bool(self.notifications_sent & 0b010)
        emails['completed'] = bool(self.notifications_sent & 0b100)
        return { 'ga_number': self.id,
                 'project': self.project_name,
                 'comment': self.project_comment,
                 'status': self.project_status,
                 'date_modified': date_modified_temp,
                 'notifications_sent': emails}

    def to_dict(self):
        date_modified_temp = None if self.status_date is None else self.status_date.date().isoformat()
        invoiced_date_temp = None if self.invoiced_date is None else self.invoiced_date.date().isoformat()
        emails = {}
        emails['recieved']  = bool(self.notifications_sent & 0b001)
        emails['lodged']    = bool(self.notifications_sent & 0b010)
        emails['completed'] = bool(self.notifications_sent & 0b100)
        return { 'id': self.id,
                 'client_fk': self.client_fk,
                 'project_name': self.project_name,
                 'project_comment': self.project_comment,
                 'project_status': self.project_status,
                 'actioned': self.actioned,
                 'report_link': self.report_link,
                 'invoiced': self.invoiced,
                 'invoiced_date': invoiced_date_temp,
                 'status_date': date_modified_temp,
                 'active': self.active,
                 'notifications_sent': emails}

    def __repr__(self):
        return f"<Project {self.id}>"

class SampleTest(db.Model):
    __tablename__ = 'sample_test'
    id = db.Column('idsample_test', db.Integer, primary_key=True)
    coc_fk = db.Column('cocFk', db.Integer)
    id_tests_fk = db.Column('idtestsFk', db.Integer)
    started = db.Column('started', db.Boolean, default=False)
    result = db.Column('result', db.Integer)
    result2 = db.Column('result2', db.Float)
    date = db.Column('date', db.DateTime)
    comment = db.Column('comment', db.String(200))
    version = db.Column('version', db.Integer)
    file_id = db.Column('file id', db.String(200))

    def to_dict(self):
        if self.result is None:
            result = self.result
        else:
            result = self.result2
        date = None if self.date is None else self.date.date().isoformat()

        test = Test.query.filter_by(id=self.id_tests_fk).first()
        test_dict = None if test is None else test.to_dict()
        return { 'test_identifier': self.id,
                 'comment': self.comment,
                 'started': self.started,
                 'result': self.result2,
                 'test_info': test_dict,
                 'date': date}

    def __repr__(self):
        return f"<SampleTest {self.id}>"

class SQLiteSequence(db.Model):
    __tablename__ = 'sqlite_sequence'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    seq = db.Column(db.Text)

    def __repr__(self):
        return f"<SQLiteSequence {self.name}>"

class Test(db.Model):
    __tablename__ = 'tests'
    id = db.Column('idtests', db.Integer, primary_key=True)
    name = db.Column('name', db.String(45))
    duration = db.Column('duration', db.Integer)
    tm = db.Column('tm', db.Integer)
    acc_number = db.Column('ACCNumber', db.String(45))
    type = db.Column('type', db.String(45))
    target = db.Column('target', db.String(100))
    report_def = db.Column('report_def', db.String(200))
    uom = db.Column('uom', db.String(45))
    lod = db.Column('lod', db.String(45))
    abv = db.Column('abv', db.String(45))
    owner = db.Column('owner', db.Integer)
    test_class = db.Column('class', db.String(45))
    mu = db.Column('MU', db.Float)

    def to_dict(self):
        return {'test_code': self.id,
                'target': self.target,
                'type': self.type,
                'duration': self.duration,
                'uom': self.uom,
                'lod': self.lod }

    def __repr__(self):
        return f"<Test {self.id}>"

from app import db
from app.api import bp
from app.errors import error_response
from app.models import Project, Coc, SampleTest, User, Client
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.jwt_functions import admin_required, get_jwt_claims
from app.email.email import recieved_email_template, submitted_email_template, completed_email_template

@bp.route('/project', methods=['GET'])
@jwt_required
def get_projects():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    client_id = user.client_id
    project_list = Project.query.filter_by(client_fk=client_id).all()
    if not project_list:
        return error_response(404, 'Whoops! Could not find any projects')
    after = request.args.get('after', default = 0, type = int)
    count = request.args.get('count', default = 0, type = int)
    finish = len(project_list) if not count else after + count
    project_slice = slice(after, finish)
    project_dict_list = [p.to_dict_minimal() for p in project_list[project_slice]]
    projects_dict = {'projects': project_dict_list}
    return jsonify(projects_dict), 200

@bp.route('/project/<int:id>', methods=['GET'])
@jwt_required
def get_project(id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    client_id = user.client_id
    project = Project.query.get(id)
    if not project:
        return error_response(404, f'Whoops! Could not find project with id {id}')
    claims = get_jwt_claims()
    if project.client_fk != client_id and not claims['admin']:
        return error_response(401, f'Unauthorised request to job! User does not own job')
    project_dict = project.to_dict()
    samples = [s.ed for s in Coc.query.filter_by(project_fk=project.id).all()]
    project_dict['samples'] = samples if samples else []
    return jsonify(project_dict), 200

@bp.route('/project/<int:id>/samples', methods=['GET'])
@jwt_required
def get_project_samples(id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    client_id = user.client_id
    project = Project.query.get(id)
    if not project:
        return error_response(404, f'Whoops! Could not find project with id {id}')
    claims = get_jwt_claims()
    if project.client_fk != client_id and not claims['admin']:
        return error_response(401, f'Unauthorised request to job! User does not own job')
    samples = [s.to_dict() for s in Coc.query.filter_by(project_fk=project.id).all()]
    if not samples:
        return error_response(404, 'Whoops! Could not find any samples')
    return jsonify(samples), 200

@bp.route('/project/<int:id>/tests', methods=['GET'])
@jwt_required
def get_project_test_numbers(id):
    test_count = 0
    test_complete = 0
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    client_id = user.client_id
    project = Project.query.get(id)
    if not project:
        return error_response(404, f'Whoops! Could not find project with id {id}')
    claims = get_jwt_claims()
    if project.client_fk != client_id and not claims['admin']:
        return error_response(401, f'Unauthorised request to job! User does not own job')
    samples = Coc.query.filter_by(project_fk = project.id).all()
    if not samples:
        return error_response(404, 'Whoops! Could not find any samples')
    for s in samples:
        tests = SampleTest.query.filter_by(coc_fk = s.ed).all()
        for test in tests:
            if not (test.result2 == None and test.result2 == None):
                test_complete += 1
            test_count += 1
    return jsonify({'test_count': test_count, 'test_complete': test_complete}), 200

@bp.route('/project/count', methods=['GET'])
@jwt_required
def get_project_numbers():
    projects_total = 0
    projects_complete = 0
    projects_incomplete = 0
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    client_id = user.client_id
    projects = Project.query.filter_by(client_fk=client_id).all()
    if not projects:
        return error_response(404, f'There are no projects!')
    for p in projects:
        projects_complete += 1 if p.project_status else 0
        projects_total += 1
    projects_incomplete = projects_total - projects_complete
    return jsonify({'total': projects_total,
                    'complete': projects_complete,
                    'incomplete': projects_incomplete}), 200


@bp.route('/project/<int:id>/notification', methods=['PATCH'])
@admin_required
def update_project_notifications_sent(id):
    project = Project.query.get(id)
    if not project:
        return error_response(404, f'Whoops! Could not find project with id {id}')
    data = request.get_json() or {}
    if not 'notification_sent' in data:
        return error_response(400, f'Missing parameter notification_sent')
    notification_number = int(data['notification_sent'])
    project.notifications_sent |= (1 << (notification_number - 1))
    try:
        db.session.commit()
    except:
        return error_response(400, 'Something broke with writing to the database')

    client = Client.query.get(project.client_fk)
    if not client:
        return error_response(404, f'Whoops! No client for project with id {id}')
    email = None
    if notification_number == 1:
        email = recieved_email_template(client, project)
    elif notification_number == 2:
        email = submitted_email_template(client, project)
    elif notification_number == 3:
        email = completed_email_template(client, project)
    else:
        return error_response(400, f'Invalid parameter notification_sent')
    response = jsonify(email.__str__())
    response.headers['Content-Type'] = "application/mbox"
    response.headers['Content-Disposition'] = 'attachment; filename="email_template.eml"'
    return response, 200

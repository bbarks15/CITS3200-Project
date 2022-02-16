from app.api import bp
from app.errors import error_response
from app.models import Project, Coc, SampleTest, User
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

@bp.route('/samples/<int:ed>', methods=['GET'])
@jwt_required
def get_sample(ed):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    client_id = user.client_id
    project_list = Project.query.filter_by(client_fk=client_id).all()
    if not project_list:
        return error_response(404, 'Whoops! Could not find any projects')
    coc = Coc.query.get(ed)
    if not coc:
        return error_response(404, f'Whoops! Could not find coc with ed {ed}')
    claims = get_jwt_claims()
    if not any(p.id == coc.project_fk for p in project_list) and not claims['admin']:
        return error_response(401, f'Whoops! coc with ed {ed} does not belong to you')
    samples_dict = coc.to_dict()
    tests = SampleTest.query.filter_by(coc_fk=coc.ed).all()
    if not tests:
        samples_dict['tests'] = []
    else:
        samples_dict['tests'] = [test.id for test in tests]
    return jsonify(samples_dict), 200


@bp.route('/samples/<int:ed>/tests', methods=['GET'])
@jwt_required
def get_sample_tests(ed):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    client_id = user.client_id
    project_list = Project.query.filter_by(client_fk=client_id).all()
    if not project_list:
        return error_response(404, 'Whoops! Could not find any projects')
    coc = Coc.query.get(ed)
    if not coc:
        return error_response(404, f'Whoops! Could not find coc with ed {ed}')
    claims = get_jwt_claims()
    if not any(p.id == coc.project_fk for p in project_list) and not claims['admin']:
        return error_response(401, f'Whoops! coc with ed {ed} does not belong to you')
    tests = SampleTest.query.filter_by(coc_fk=coc.ed).all()
    tests_dict = {}
    if not tests:
        return error_response(404, f'Whoops! Could not find any tests for sample with ed {ed}')
    else:
        return jsonify([test.to_dict() for test in tests]), 200

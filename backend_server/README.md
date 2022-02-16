# Setup

This application is made with python 3.8.5 and all instructions are made for
Linux based systems.

# Using Script

Run the script provided (setup.sh)

It should create the virtual environment and install the necessary modules

**Note this is made for linux and is not very robust. So it might not work**

# Manual Setup

Make sure you are using python 3.8.5

Create a python virtual environment in the `backend_server` directory. Firstly
make sure that the python virtual environment module is installed. To create the
virtual environment run the following command

```
python -m venv venv
```

This creates a virtual environment in the folder venv.

Next activate the virtual environment by running

```
source venv/bin/activate
```

If successful a `(venv)` should appear before your prompt. The required modules
are in `requirements.txt`. To install them run

```
pip install -r requirements.txt
```
Now everything should be set-up to run the backend server.

# Running

Make sure the source the virtual environment `source venv/bin/activate`

Simply run `flask run`

# Extra

Quit virtual environment run `deactivate`

Will need to set `WEBSITE_URL` in `config.py`

# Email

The client will need to setup mail account for password resets and
registrations.

These setting will need to be changed in `config.py`

```
MAIL_SERVER = 'smtp.googlemail.com'
MAIL_DEFAULT_SENDER = 'EMAIL_ADDRESS'
MAIL_USERNAME = 'EMAIL_ACCOUNT_USERNAME'
MAIL_PASSWORD = 'EMAIL_ACCOUNT_PASSWORD'
```

# Current API Routes

```
app/auth/auth.py
9:@bp.route('/login', methods=['POST'])

app/auth/register.py
7:@bp.route('/register', methods=['POST'])

app/auth/password_reset.py
13:@bp.route('/reset_password', methods=['POST'])
33:@bp.route('/password', methods=['PATCH'])

app/api/samples.py
7:@bp.route('/samples/<int:ed>', methods=['GET'])
30:@bp.route('/samples/<int:ed>/tests', methods=['GET'])

app/api/project.py
10:@bp.route('/project', methods=['GET'])
27:@bp.route('/project/<int:id>', methods=['GET'])
44:@bp.route('/project/<int:id>/samples', methods=['GET'])
61:@bp.route('/project/<int:id>/tests', methods=['GET'])
86:@bp.route('/project/count', methods=['GET'])
104:@bp.route('/project/<int:id>/notification', methods=['PATCH'])

app/api/users.py
25:@bp.route('/user', methods=['GET'])
37:@bp.route('/user', methods=['PATCH'])
70:@bp.route('/user/<int:id>', methods=['PATCH'])
102:@bp.route('/user/<int:id>', methods=['DELETE'])
115:@bp.route('/me', methods=['GET'])
128:@bp.route('/user/<int:id>', methods=['GET'])
149:@bp.route('/user/register', methods=['POST'])
168:@bp.route('/user/create', methods=['POST'])
202:@bp.route('/user/password', methods=['PATCH'])
224:@bp.route('/user/<int:id>/password', methods=['PATCH'])
241:@bp.route('/user/<int:id>/projects', methods=['GET'])

app/api/clients.py
9:@bp.route('/client', methods=['GET'])
26:@bp.route('/client/<int:id>', methods=['GET'])

app/api/test.py
8:@bp.route('/test/<int:id>', methods=['GET'])
```

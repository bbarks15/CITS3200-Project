from app import create_app, db
from app.models import Client, Coc, Project, SampleTest, SQLiteSequence, Test, User

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return { 'db': db,
             'Client': Client,
             'Coc': Coc,
             'Project': Project,
             'SampleTest': SampleTest,
             'SQLiteSequence': SQLiteSequence,
             'Test': Test,
             'User': User}

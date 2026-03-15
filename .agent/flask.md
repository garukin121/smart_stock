# Flask

Flask is a lightweight WSGI web application framework for Python, designed to make getting started quick and easy while remaining flexible enough to scale to complex applications. It began as a simple wrapper around Werkzeug (WSGI toolkit) and Jinja (templating engine), and has become one of the most popular Python web frameworks.

Flask offers suggestions but doesn't enforce any dependencies or project layout, giving developers freedom to choose their tools and libraries. It provides the core functionality needed to build web applications including routing, request handling, sessions, templating, and more. The framework is extended through a rich ecosystem of Flask extensions that add capabilities like database integration, authentication, form handling, and API development.

## Creating a Flask Application

The Flask class is the central object that acts as the WSGI application. It is passed the name of the module or package of the application and acts as a central registry for view functions, URL rules, template configuration, and more.

```python
from flask import Flask

# Create the Flask application instance
app = Flask(__name__)

# Configure the application
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['DEBUG'] = True

# Define a simple route
@app.route('/')
def hello():
    return 'Hello, World!'

# Run the development server
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
```

## URL Routing with @app.route()

The route() decorator binds a function to a URL rule. It supports variable rules with type converters (string, int, float, path, uuid), multiple routes per function, and trailing slash behavior control.

```python
from flask import Flask, url_for
from markupsafe import escape

app = Flask(__name__)

# Basic route
@app.route('/')
def index():
    return 'Index Page'

# Route with variable (default string type)
@app.route('/user/<username>')
def show_user(username):
    return f'User: {escape(username)}'

# Route with typed variable (int converter)
@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post ID: {post_id}'

# Route with path converter (accepts slashes)
@app.route('/files/<path:filepath>')
def show_file(filepath):
    return f'File path: {escape(filepath)}'

# Multiple routes for same function
@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    if name:
        return f'Hello, {escape(name)}!'
    return 'Hello, World!'

# Generate URLs programmatically
with app.test_request_context():
    print(url_for('index'))              # Output: /
    print(url_for('show_user', username='john'))  # Output: /user/john
    print(url_for('show_post', post_id=42))       # Output: /post/42
```

## HTTP Methods (GET, POST, PUT, DELETE)

Flask provides decorators for common HTTP methods and allows handling multiple methods in a single view function. By default, routes only respond to GET requests.

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

# Handle multiple methods in one function
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        # Validate credentials...
        return jsonify({'status': 'logged in', 'user': username})
    # GET request - show login form
    return '''
        <form method="post">
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <button type="submit">Login</button>
        </form>
    '''

# Method-specific decorators (Flask 2.0+)
@app.get('/users')
def list_users():
    return jsonify({'users': ['alice', 'bob', 'charlie']})

@app.post('/users')
def create_user():
    data = request.get_json()
    return jsonify({'created': data['name']}), 201

@app.put('/users/<int:user_id>')
def update_user(user_id):
    data = request.get_json()
    return jsonify({'updated': user_id, 'data': data})

@app.delete('/users/<int:user_id>')
def delete_user(user_id):
    return jsonify({'deleted': user_id}), 204
```

## Request Object - Accessing Request Data

The global request object provides access to incoming request data including form data, query parameters, JSON payloads, files, headers, and cookies.

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/api/data', methods=['GET', 'POST'])
def handle_data():
    # Access query string parameters (?key=value)
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)

    # Access form data (POST with form-encoded body)
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email', 'default@example.com')

    # Access JSON payload
    if request.is_json:
        json_data = request.get_json()
        name = json_data.get('name')

    # Access headers
    auth_header = request.headers.get('Authorization')
    content_type = request.headers.get('Content-Type')

    # Access cookies
    session_id = request.cookies.get('session_id')

    # Request metadata
    method = request.method          # 'GET', 'POST', etc.
    url = request.url                # Full URL
    path = request.path              # URL path
    remote_addr = request.remote_addr  # Client IP address

    return {
        'method': method,
        'page': page,
        'limit': limit,
        'path': path
    }
```

## JSON APIs - Returning JSON Responses

Flask automatically converts dict and list return values to JSON responses. The jsonify() function provides more control over JSON serialization.

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

# Return dict - automatically converted to JSON
@app.route('/api/user/<int:user_id>')
def get_user(user_id):
    user = {
        'id': user_id,
        'name': 'John Doe',
        'email': 'john@example.com',
        'active': True
    }
    return user  # Automatically becomes application/json

# Return list - automatically converted to JSON array
@app.route('/api/users')
def get_users():
    users = [
        {'id': 1, 'name': 'Alice'},
        {'id': 2, 'name': 'Bob'},
        {'id': 3, 'name': 'Charlie'}
    ]
    return users

# Using jsonify with status code
@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.get_json()

    if not data or 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400

    new_item = {
        'id': 123,
        'name': data['name'],
        'created': True
    }
    return jsonify(new_item), 201

# JSON with custom headers
@app.route('/api/status')
def status():
    response = jsonify({
        'status': 'healthy',
        'version': '1.0.0'
    })
    response.headers['X-Custom-Header'] = 'CustomValue'
    return response
```

## Rendering Templates with Jinja2

Flask uses Jinja2 templating engine for rendering HTML templates. Templates are stored in the templates folder by default and support inheritance, filters, and control structures.

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/user/<name>')
def user_profile(name):
    # Pass variables to template
    return render_template('profile.html',
                          username=name,
                          posts=['Post 1', 'Post 2', 'Post 3'],
                          is_admin=False)

@app.route('/dashboard')
def dashboard():
    data = {
        'title': 'Dashboard',
        'users': [
            {'name': 'Alice', 'email': 'alice@example.com'},
            {'name': 'Bob', 'email': 'bob@example.com'}
        ],
        'stats': {'total': 100, 'active': 75}
    }
    return render_template('dashboard.html', **data)

# Example template (templates/profile.html):
"""
<!DOCTYPE html>
<html>
<head><title>{{ username }}'s Profile</title></head>
<body>
    <h1>Welcome, {{ username }}!</h1>

    {% if is_admin %}
        <p>You have admin privileges.</p>
    {% endif %}

    <h2>Posts:</h2>
    <ul>
    {% for post in posts %}
        <li>{{ post }}</li>
    {% endfor %}
    </ul>
</body>
</html>
"""
```

## Session Management

Flask provides secure cookie-based sessions for storing user data across requests. Sessions are cryptographically signed using the SECRET_KEY.

```python
from flask import Flask, session, redirect, url_for, request

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'

@app.route('/')
def index():
    if 'username' in session:
        return f'Logged in as {session["username"]}'
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Store user info in session
        session['username'] = request.form['username']
        session['user_id'] = 12345
        session.permanent = True  # Session survives browser close
        return redirect(url_for('index'))
    return '''
        <form method="post">
            <input type="text" name="username">
            <button type="submit">Login</button>
        </form>
    '''

@app.route('/logout')
def logout():
    # Remove user from session
    session.pop('username', None)
    session.pop('user_id', None)
    # Or clear entire session: session.clear()
    return redirect(url_for('index'))

@app.route('/profile')
def profile():
    # Access session data
    if 'username' not in session:
        return redirect(url_for('login'))
    return f"User: {session['username']}, ID: {session.get('user_id')}"
```

## Error Handling and Custom Error Pages

Flask allows registering custom error handlers to provide user-friendly error pages and JSON error responses for APIs.

```python
from flask import Flask, render_template, jsonify, abort, request

app = Flask(__name__)

# Custom 404 error handler
@app.errorhandler(404)
def page_not_found(error):
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Resource not found'}), 404
    return render_template('404.html'), 404

# Custom 500 error handler
@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Handle specific exception types
@app.errorhandler(ValueError)
def handle_value_error(error):
    return jsonify({'error': str(error)}), 400

# Custom exception class for API errors
class APIError(Exception):
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

@app.errorhandler(APIError)
def handle_api_error(error):
    response = {'error': error.message}
    if error.payload:
        response['details'] = error.payload
    return jsonify(response), error.status_code

# Using abort() to raise HTTP errors
@app.route('/api/user/<int:user_id>')
def get_user(user_id):
    user = find_user(user_id)  # Your lookup function
    if user is None:
        abort(404, description='User not found')
    return jsonify(user)

# Using custom exception
@app.route('/api/validate', methods=['POST'])
def validate():
    data = request.get_json()
    if not data:
        raise APIError('No data provided', 400)
    if 'email' not in data:
        raise APIError('Email is required', 400, {'field': 'email'})
    return jsonify({'valid': True})
```

## Blueprints - Modular Applications

Blueprints allow organizing a Flask application into reusable components. Each blueprint can have its own views, templates, static files, and error handlers.

```python
from flask import Flask, Blueprint, render_template, jsonify

# Create blueprints for different parts of the app
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')
admin_bp = Blueprint('admin', __name__,
                     url_prefix='/admin',
                     template_folder='templates/admin')

# Auth blueprint routes
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    return 'Login page'

@auth_bp.route('/logout')
def logout():
    return 'Logged out'

# API blueprint routes
@api_bp.route('/users')
def list_users():
    return jsonify({'users': []})

@api_bp.route('/users/<int:user_id>')
def get_user(user_id):
    return jsonify({'id': user_id, 'name': 'User'})

# Admin blueprint with its own error handler
@admin_bp.route('/')
def admin_index():
    return 'Admin Dashboard'

@admin_bp.errorhandler(403)
def admin_forbidden(error):
    return 'Admin access denied', 403

# Register blueprints with the main app
app = Flask(__name__)
app.register_blueprint(auth_bp)
app.register_blueprint(api_bp)
app.register_blueprint(admin_bp)

# Nested blueprints
parent_bp = Blueprint('parent', __name__, url_prefix='/parent')
child_bp = Blueprint('child', __name__, url_prefix='/child')

@child_bp.route('/action')
def child_action():
    return 'Child action'

parent_bp.register_blueprint(child_bp)
app.register_blueprint(parent_bp)
# Accessible at: /parent/child/action
```

## Request Hooks - Before and After Request

Flask provides hooks to execute code before and after each request, useful for database connections, authentication, and response modification.

```python
from flask import Flask, g, request, jsonify
import time

app = Flask(__name__)

# Run before every request
@app.before_request
def before_request():
    g.start_time = time.time()

    # Authentication check
    if request.endpoint and request.endpoint.startswith('api.'):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Authorization required'}), 401
        g.user = validate_token(token)  # Your validation function

# Run after every request
@app.after_request
def after_request(response):
    # Add timing header
    if hasattr(g, 'start_time'):
        elapsed = time.time() - g.start_time
        response.headers['X-Response-Time'] = f'{elapsed:.3f}s'

    # Add security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    return response

# Run after request completes (even if error occurred)
@app.teardown_request
def teardown_request(exception=None):
    # Close database connection
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

# Run when app context is torn down
@app.teardown_appcontext
def teardown_appcontext(exception=None):
    # Cleanup resources
    pass

@app.route('/api/data')
def get_data():
    return jsonify({'user': g.user, 'data': 'example'})
```

## File Uploads

Flask handles file uploads through the request.files dictionary. Files should be validated for allowed extensions and saved securely.

```python
from flask import Flask, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/path/to/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if file was submitted
        if 'file' not in request.files:
            return 'No file part', 400

        file = request.files['file']

        # Check if file was selected
        if file.filename == '':
            return 'No selected file', 400

        if file and allowed_file(file.filename):
            # Secure the filename to prevent directory traversal
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            return redirect(url_for('download_file', filename=filename))

        return 'File type not allowed', 400

    return '''
    <!doctype html>
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <button type="submit">Upload</button>
    </form>
    '''

@app.route('/uploads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
```

## Configuration Management

Flask provides multiple ways to configure applications, supporting different configurations for development, testing, and production environments.

```python
from flask import Flask
import os

app = Flask(__name__)

# Direct configuration
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'dev-secret-key'

# Update multiple values at once
app.config.update(
    TESTING=False,
    SECRET_KEY='production-secret-key',
    DATABASE_URI='postgresql://localhost/myapp'
)

# Load from environment variables with prefix
# FLASK_SECRET_KEY, FLASK_DATABASE_URI, etc.
app.config.from_prefixed_env()

# Load from Python file
app.config.from_pyfile('config.py', silent=True)

# Load from object/class
class Config:
    SECRET_KEY = 'base-secret'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_URI = 'sqlite:///dev.db'

class ProductionConfig(Config):
    DEBUG = False
    DATABASE_URI = os.environ.get('DATABASE_URL')

# Load configuration class
config_name = os.environ.get('FLASK_CONFIG', 'development')
configs = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
app.config.from_object(configs[config_name])

# Load from JSON/TOML files
import json
import tomllib
app.config.from_file('config.json', load=json.load)
app.config.from_file('config.toml', load=tomllib.load, text=False)
```

## Testing Flask Applications

Flask provides test client and utilities for testing applications with pytest. The test client simulates requests without running a server.

```python
import pytest
from flask import Flask, jsonify, session

# Application to test
def create_app(config=None):
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'test-secret'

    if config:
        app.config.update(config)

    @app.route('/')
    def index():
        return 'Hello, World!'

    @app.route('/api/data', methods=['POST'])
    def create_data():
        return jsonify(request.get_json()), 201

    @app.route('/login', methods=['POST'])
    def login():
        session['user'] = 'testuser'
        return jsonify({'logged_in': True})

    return app

# Pytest fixtures
@pytest.fixture
def app():
    app = create_app({'TESTING': True})
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

# Test cases
def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Hello, World!' in response.data

def test_json_post(client):
    response = client.post('/api/data',
                          json={'name': 'test', 'value': 123})
    assert response.status_code == 201
    assert response.json['name'] == 'test'

def test_session(client):
    with client:
        client.post('/login')
        assert session['user'] == 'testuser'

def test_session_modification(client):
    with client.session_transaction() as sess:
        sess['user_id'] = 42

    response = client.get('/profile')
    # Session is now set before the request

def test_with_context(app):
    with app.test_request_context('/path?name=test'):
        assert request.path == '/path'
        assert request.args['name'] == 'test'
```

## Application Factory Pattern

The application factory pattern creates the Flask app inside a function, allowing multiple app instances with different configurations for testing and modularity.

```python
from flask import Flask

def create_app(config_name='default'):
    app = Flask(__name__)

    # Load configuration
    config = {
        'default': 'config.DefaultConfig',
        'development': 'config.DevelopmentConfig',
        'production': 'config.ProductionConfig',
        'testing': 'config.TestingConfig'
    }
    app.config.from_object(config[config_name])

    # Initialize extensions
    from extensions import db, migrate, login_manager
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    # Register blueprints
    from blueprints.auth import auth_bp
    from blueprints.api import api_bp
    from blueprints.main import main_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp, url_prefix='/api/v1')

    # Register error handlers
    @app.errorhandler(404)
    def not_found(e):
        return {'error': 'Not found'}, 404

    # Register shell context
    @app.shell_context_processor
    def make_shell_context():
        return {'db': db, 'User': User}

    return app

# Usage
# Development
app = create_app('development')

# Testing
test_app = create_app('testing')
client = test_app.test_client()

# Production (via WSGI server)
# gunicorn "app:create_app('production')"
```

## Context Locals - g, current_app, request, session

Flask provides context-local objects that are unique to each request. The `g` object stores request-scoped data, while `current_app` provides access to the application.

```python
from flask import Flask, g, current_app, request, session

app = Flask(__name__)
app.secret_key = 'secret'

def get_db():
    """Get database connection for current request."""
    if 'db' not in g:
        g.db = connect_to_database()  # Your connection function
    return g.db

@app.teardown_appcontext
def close_db(error):
    """Close database at end of request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.before_request
def load_user():
    """Load user from session into g."""
    user_id = session.get('user_id')
    if user_id:
        g.user = get_user_by_id(user_id)  # Your lookup function
    else:
        g.user = None

@app.route('/api/data')
def get_data():
    # Access request context locals
    db = get_db()
    user = g.user

    # Access current application config
    debug_mode = current_app.config['DEBUG']

    # Access request data
    client_ip = request.remote_addr

    return {
        'user': user.name if user else None,
        'debug': debug_mode,
        'ip': client_ip
    }

# Using app context outside of request
with app.app_context():
    # current_app is available here
    print(current_app.config['SECRET_KEY'])

    # Create test request context
    with app.test_request_context('/test?param=value'):
        print(request.args['param'])  # 'value'
```

## Redirects and URL Building

Flask provides url_for() for building URLs and redirect() for sending users to different endpoints, supporting both internal and external redirects.

```python
from flask import Flask, redirect, url_for, request, abort

app = Flask(__name__)

@app.route('/')
def index():
    return 'Home Page'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # After successful login, redirect to dashboard
        return redirect(url_for('dashboard'))
    return 'Login Form'

@app.route('/dashboard')
def dashboard():
    if not is_logged_in():
        # Redirect with next parameter for return URL
        return redirect(url_for('login', next=request.url))
    return 'Dashboard'

@app.route('/user/<username>')
def user_profile(username):
    return f'Profile: {username}'

@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post {post_id}'

@app.route('/old-page')
def old_page():
    # Permanent redirect (301)
    return redirect(url_for('new_page'), code=301)

@app.route('/new-page')
def new_page():
    return 'New Page'

# URL building examples
with app.test_request_context():
    # Basic URL building
    print(url_for('index'))                    # /
    print(url_for('login'))                    # /login

    # With URL variables
    print(url_for('user_profile', username='john'))  # /user/john
    print(url_for('show_post', post_id=42))          # /post/42

    # With query parameters
    print(url_for('login', next='/dashboard'))  # /login?next=/dashboard

    # External URLs (include scheme and host)
    print(url_for('index', _external=True))    # http://localhost/

    # With anchor
    print(url_for('show_post', post_id=1, _anchor='comments'))  # /post/1#comments
```

Flask is ideal for building web applications ranging from simple single-page apps to complex RESTful APIs and full-featured web services. Its lightweight core combined with a rich extension ecosystem makes it suitable for prototyping, microservices, and production applications. Common use cases include REST APIs, web dashboards, content management systems, and backend services.

Integration with Flask typically follows patterns like using application factories for testability, blueprints for modularity, and extensions for common functionality (Flask-SQLAlchemy for databases, Flask-Login for authentication, Flask-RESTful for APIs). The framework integrates well with WSGI servers like Gunicorn and uWSGI for production deployment, and supports async views when paired with an ASGI server. Flask's simplicity and flexibility make it an excellent choice for both learning web development and building scalable production systems.

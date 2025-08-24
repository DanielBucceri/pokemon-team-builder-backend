# Pokémon Team Builder – API Backend

A secure, JWT protected REST API that lets trainers design custom Pokémon builds, assemble competitive teams, and manage their collections programmatically. This back-end is intended for integration with a dedicated web or mobile application frontend.

---

# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions to automate testing and deployment. The pipeline ensures code quality through automated testing and provides reliable deployment to production.

## Pipeline Components

### 1. Main CI/CD Workflow (`docker-ci.yml`)

**Purpose**: Automated testing and deployment on code changes

**Triggers**:
- Push to `main` or `dev` branches  
- Pull requests to `main` or `dev` branches

**Process**:
1. **Build**: Creates Docker production image
2. **Test**: Runs Jest test suite in containerized environment  
3. **Custom Reports**: Generates detailed test reports with build information
4. **Deploy**: Triggers Render deployment on successful main branch builds

**Key Features**:
- Environment-specific configuration using secrets
- Custom test report generation with build metadata
- Artifact storage for test reports (14-day retention)

### 2. Weekly Status Check (`weekly-check.yml`)

**Purpose**: Scheduled monitoring and status reporting

**Triggers**:
- Weekly schedule (Mondays at 10 AM UTC)
- Manual workflow dispatch

**Features**:
- Generates weekly status reports
- Checks repository accessibility
- Creates artifacts for status tracking

## Technology Choices & Comparisons

### CI/CD Platform: GitHub Actions

**Why GitHub Actions was chosen:**

| Criteria | GitHub Actions | Jenkins | GitLab CI |
|----------|----------------|---------|-----------|
| **Setup** |  No server needed |  Requires server setup |  GitLab-only |
| **Cost** |  Free for public repos |  Infrastructure costs |  Limited free tier |
| **Integration** |  Native GitHub |  Plugins needed |  Native GitLab |
| **Learning Curve** | Simple YAML |  Complex configuration |  Moderate |

**GitHub Actions benefits for this project:**
- Zero infrastructure setup required
- Seamless integration with GitHub repository
- Extensive marketplace of pre-built actions
- Excellent documentation and community support

### Containerization: Docker

**Docker provides consistent environments:**

```
Development → Testing → Production
     ↓           ↓          ↓
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Node.js │ │ Node.js │ │ Node.js │
│MongoDB  │ │MongoDB  │ │MongoDB  │
│Same Deps│ │Same Deps│ │Same Deps│
└─────────┘ └─────────┘ └─────────┘
```

**Alternative approaches considered:**
- **Direct deployment**: Rejected due to environment inconsistencies
- **Virtual machines**: Rejected due to resource overhead
- **Serverless**: Rejected due to database connection complexities

### Testing Framework: Jest + Supertest

**Chosen for comprehensive API testing:**

| Feature | Jest + Supertest | Mocha + Chai | Vitest |
|---------|------------------|--------------|--------|
| **Setup** |  Minimal configuration |  Multiple packages |  Simple setup |
| **API Testing** |  Built-in HTTP testing |  Additional tools needed |  External libraries |
| **Mocking** |  Comprehensive mocking |  Separate library |  Built-in |
| **Industry Usage** |  Widely adopted |  Established |  Growing |

### Deployment Platform: Render

**Selected for cloud hosting:**

| Factor | Render | Heroku | AWS EC2 |
|--------|--------|--------|---------|
| **Ease of Use** |  Simple dashboard |  User-friendly |  Complex setup |
| **Cost** |  Free tier available |  Paid plans only |  Pay-per-use |
| **Docker Support** |  Native support |  Container registry |  Full flexibility |
| **Database Integration** |  Built-in database options |  Add-on marketplace |  Full control |

## Workflow Examples

### Development Workflow
```
Code Changes → GitHub Push → Actions Trigger → Docker Build → Jest Tests → Custom Reports → Deploy (if main)
```

### Weekly Monitoring
```
Monday 10 AM → Scheduled Trigger → Status Check → Generate Report → Store Artifact
```

## Benefits

- **Quality Assurance**: Automated testing prevents broken code deployment
- **Consistency**: Docker ensures identical environments across stages  
- **Traceability**: Custom reports provide detailed build information
- **Monitoring**: Weekly checks maintain system health awareness
- **Efficiency**: Automated processes reduce manual deployment errors


# JavaScript Style Guide

This project follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as its base style guide.

## Why Airbnb Style Guide?

We've chosen the Airbnb style guide for this project because:

1. **Industry Standard**: It's widely recognized and used in the JavaScript community
2. **Well-documented**: Provides clear, comprehensive rules and explanations
3. **Promotes Best Practices**: Encourages patterns that improve code readability and maintainability
4. **Modern JavaScript**: Designed for ES6+ development

## Code Organization

Our project follows these organizational principles:

### Architecture
- **MVC Pattern**: Models, Views (API responses) and Controllers are kept separate
- **Modular Design**: Code is organized by feature and responsibility

### File Structure
- `src/models`: Database schemas and models
- `src/controllers`: Business logic and request handling
- `src/routes`: API route definitions
- `src/middleware`: Request processing middleware (authentication, validation, etc.)
- `src/tests`: Test files

## Naming Conventions

- **camelCase**: For variables, functions, and methods
- **PascalCase**: For classes
- **UPPERCASE_WITH_UNDERSCORES**: For constants

## ES Modules

We use ES Modules syntax instead of CommonJS:
- Use `import` and `export` statements
- Include file extensions in import paths

## Enforcement

This style guide is enforced using ESLint with the Airbnb base configuration:

```bash
# Check code against style guide
npm run lint

# Automatically fix eligible style issues
npm run lint:fix
```
## External Libraries

### Core Framework & Runtime
- **Express.js**: Web application framework for building RESTful APIs with robust routing and middleware support
- **Node.js**: JavaScript runtime environment enabling server-side JavaScript execution

### Database & ODM
- **MongoDB**: NoSQL document database chosen for flexible schema design suitable for gaming data structures
- **Mongoose**: Object Document Mapping library providing schema validation, query building, and business logic hooks

### Security & Authentication  
- **jsonwebtoken**: Industry standard JWT implementation for secure user authentication and stateless session management
- **bcryptjs**: Password hashing library using adaptive hashing algorithm for secure password storage with salt rounds
- **cors**: Cross-Origin Resource Sharing middleware enabling controlled API access from different domains

### Configuration & Environment
- **dotenv**: Environment variable management for secure configuration and secret handling

### Development & Testing
- **Jest**: JavaScript testing framework with built-in test runner, assertion library, and mocking capabilities
- **Supertest**: HTTP assertion library specifically designed for testing Express applications and API endpoints
- **ESLint**: Static code analysis tool for identifying and fixing code quality issues according to Airbnb standards
- **Nodemon**: Development utility that automatically restarts the server when file changes are detected

### Hardware Requirements
- **Development**: Any modern computer with at least 2 CPU cores, 2GB RAM, and 1GB free disk space. Works on Windows, macOS, or Linux.
- **Recommended Node.js Version**: 18.x or higher
- **Database**: MongoDB 5.0+ 

### Alternative Technology Comparisons
- **Express.js vs Fastify**: Chose Express for its mature ecosystem, extensive middleware support, and team familiarity
- **MongoDB vs PostgreSQL**: Selected MongoDB for flexible schema design ideal for evolving game data requirements
- **Jest vs Mocha**: Chose Jest for its comprehensive all-in-one testing solution with builtin mocking
- **bcryptjs vs Argon2**: Selected bcryptjs for its proven security track record and wide industry adoption

### Licensing
All external dependencies use permissive licenses (MIT, Apache 2.0, BSD) compatible with commercial use and distribution.

# Web Server Implementation Features

This API implements industry standard features to ensure secure, robust, and flexible communication between clients and the server.

## 1. HTTP Headers

Headers are used throughout the application for various purposes:

### Authorization Headers
```javascript
// Example from authenticate.js middleware
const authHeader = req.header('Authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ message: 'Access denied. No token provided.' });
}
```

### Content-Type Headers
```javascript
// Automatically handled by Express middleware
app.use(express.json()); // Parses incoming requests with JSON payloads
```

### Custom Response Headers
Our application uses CORS middleware to properly set Access-Control headers:
```javascript
app.use(cors());
```

## 2. Request Body Content

The application processes JSON body content for data submission and updates:

### User Registration Example
```javascript
// Extract data from request body in userController.js
const { username, password } = req.body;
```

### Team Creation Example
```javascript
// Extract and validate team data from request body in teamController.js
req.body.user = req.user.id;

// Validate team size max 6 per team
if (validateTeamSize(req.body.pokemonBuilds)) {
  return res.status(400).json({
    success: false,
    error: 'Teams can have a maximum of 6 Pokemon',
  });
}
```

## 3. URL Params

Route parameters are used to identify specific resources:

### Team-specific Operations
```javascript
// From teamRoutes.js - Team ID as parameter
router.route('/teams/:id')
  .put(updateTeam)
  .delete(deleteTeam)
  .get(getTeamById);
```

### Nested Routes
```javascript
// From teamRoutes.js - Using multiple parameters for related resources
router.route('/teams/:id/pokemon/:buildId')
  .post(addPokemonToTeam)
  .delete(removePokemonFromTeam);
```

### Parameter Extraction in Controllers
```javascript
// From teamController.js
const team = await Team.findOne({
  _id: req.params.id,
  user: req.user.id,
});
```

## 4. Authorization

The application implements a comprehensive JWT based authentication system:

### JWT Token Generation (Login)
```javascript
// userController.js
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
```

### Authentication Middleware
```javascript
// authenticate.js middleware
export const authenticate = (req, res, next) => {
  // Extract token from Authorization header
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
```

### Route Protection
```javascript
// teamRoutes.js - Protect all team routes
router.use(authenticate);
```

### User-specific Data Access
```javascript
// teamController.js - Ensures users can only access their own data
const teams = await Team.find({ user: req.user.id })
  .populate('pokemonBuilds', 'species nickname stats');
```

## References

- Node.js Foundation 2024, 'ES Modules', Node.js v20 Documentation, Node.js Foundation, viewed 26 May 2025, <https://nodejs.org/api/esm.html>.
- Express.js 2024, 'Using middleware', Express 5 Documentation, Express.js, viewed 27 May 2025, <https://expressjs.com/en/guide/using-middleware.html>.
- Express.js 2024, 'Error handling', Express 5 Documentation, Express.js, viewed 1 June 2025, <https://expressjs.com/en/guide/error-handling.html>.
- Mongoose 2024, 'Query Population (``.populate()``)', Mongoose v8 Documentation, Automattic Inc., viewed 28 May 2025, <https://mongoosejs.com/docs/populate.html>.
- MongoDB Inc. 2024, 'Query Documents', MongoDB Manual v8.0, MongoDB Inc., viewed 29 May 2025, <https://www.mongodb.com/docs/manual/tutorial/query-documents/>.
- Auth0 2024, 'jsonwebtoken Usage (sign/verify)', GitHub Repository, viewed 30 May 2025, <https://github.com/auth0/node-jsonwebtoken#usage>.
- Jest 2024, 'ECMAScript Modules', Jest Documentation, Meta Platforms Inc., viewed 31 May 2025, <https://jestjs.io/docs/ecmascript-modules>.
-
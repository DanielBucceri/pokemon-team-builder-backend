# Pokémon Team Builder – API Backend

A secure, JWT protected REST API that lets trainers design custom Pokémon builds, assemble competitive teams, and manage their collections programmatically. This back-end is intended for integration with a dedicated web or mobile application frontend.


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

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

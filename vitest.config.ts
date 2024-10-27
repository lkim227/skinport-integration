// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,  // Allows you to use global variables in your tests (like `describe`, `it`, etc.)
        include: ['src/**/*.test.ts'],  // Include test files in src and subfolders
        exclude: ['node_modules', 'dist'], // Exclude unwanted directories
        environment: 'node', // Set environment to Node
        coverage: {
            provider: 'v8', // Use 'v8' instead of 'c8' as coverage provider
            reporter: ['text', 'json', 'html'], // Formats of coverage reports
            exclude: ['src/interfaces', 'tests'] // Files to exclude from coverage reports
        },
    },
});

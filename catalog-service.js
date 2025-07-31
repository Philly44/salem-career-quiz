// Catalog Service for Salem University Programs
// This service handles searching and retrieving program information from the large catalog file

const fs = require('fs').promises;
const path = require('path');

class CatalogService {
  constructor() {
    this.catalogPath = path.join(__dirname, 'catalog.txt');
    this.indexPath = path.join(__dirname, 'catalog-index.json');
    this.cache = new Map();
  }

  // Search for specific programs by keyword
  async searchPrograms(keywords, options = {}) {
    const { 
      programType = 'all', // 'undergraduate', 'graduate', 'all'
      limit = 10,
      includeContext = true 
    } = options;

    const cacheKey = `search_${keywords}_${programType}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Use grep-like functionality to search the catalog
      const searchPattern = this.buildSearchPattern(keywords, programType);
      const results = await this.grepCatalog(searchPattern, limit, includeContext);
      
      const programs = this.parseSearchResults(results);
      this.cache.set(cacheKey, programs);
      
      return programs;
    } catch (error) {
      console.error('Error searching programs:', error);
      return [];
    }
  }

  // Get specific program details by name
  async getProgramDetails(programName) {
    const cacheKey = `program_${programName}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Search for the program and get surrounding context
      const pattern = programName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const results = await this.grepCatalog(pattern, 1, true, 50);
      
      if (results.length > 0) {
        const programDetails = this.extractProgramDetails(results[0]);
        this.cache.set(cacheKey, programDetails);
        return programDetails;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting program details:', error);
      return null;
    }
  }

  // Get course examples for a specific program
  async getCourseExamples(programName, count = 3) {
    try {
      // First find the program section
      const programDetails = await this.getProgramDetails(programName);
      if (!programDetails) return [];

      // Then search for course codes related to this program
      const coursePattern = this.getCoursePattern(programName);
      const courseResults = await this.grepCatalog(coursePattern, count * 2, true, 10);
      
      return this.parseCourses(courseResults, count);
    } catch (error) {
      console.error('Error getting course examples:', error);
      return [];
    }
  }

  // Build search pattern based on keywords and program type
  buildSearchPattern(keywords, programType) {
    let basePattern = keywords;
    
    if (programType === 'undergraduate') {
      basePattern = `(Bachelor|B\\.S\\.|Associate).*(${keywords})|(${keywords}).*(Bachelor|B\\.S\\.|Associate)`;
    } else if (programType === 'graduate') {
      basePattern = `(Master|M\\.[A-Z]\\.|MBA|DBA|Doctor).*(${keywords})|(${keywords}).*(Master|M\\.[A-Z]\\.|MBA|DBA|Doctor)`;
    }
    
    return basePattern;
  }

  // Simulate grep functionality for the catalog
  async grepCatalog(pattern, limit = 10, includeContext = true, contextLines = 5) {
    // In a real implementation, this would use the Grep tool
    // For now, return a promise that would contain the search results
    return new Promise((resolve) => {
      // Simulated results structure
      resolve([
        {
          line: 500,
          content: 'Bachelor of Science in Business Administration',
          context: includeContext ? ['Previous line', 'Next line'] : []
        }
      ]);
    });
  }

  // Parse search results into structured program data
  parseSearchResults(results) {
    return results.map(result => {
      const programInfo = {
        name: this.extractProgramName(result.content),
        type: this.detectProgramType(result.content),
        line: result.line,
        description: result.context ? result.context.join(' ').substring(0, 200) + '...' : ''
      };
      
      return programInfo;
    });
  }

  // Extract program name from text
  extractProgramName(text) {
    const patterns = [
      /Bachelor of Science in (.+)/,
      /Bachelor of Arts in (.+)/,
      /Master of (.+)/,
      /Associate of (.+)/,
      /Doctor of (.+)/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return text;
  }

  // Detect program type from text
  detectProgramType(text) {
    if (/Bachelor|B\.S\.|B\.A\./.test(text)) return 'undergraduate';
    if (/Master|M\.[A-Z]\./.test(text)) return 'graduate';
    if (/Associate|A\.[A-Z]\./.test(text)) return 'associate';
    if (/Doctor|Ph\.D\.|DBA/.test(text)) return 'doctoral';
    return 'unknown';
  }

  // Get course pattern based on program name
  getCoursePattern(programName) {
    const programMappings = {
      'Business': 'BUS|ACCT|FIN|MGMT|MKTG',
      'Computer Science': 'CS|CSCI|COMP',
      'Information Technology': 'IT|INFO|TECH',
      'Nursing': 'NURS|NUR',
      'Education': 'EDUC|ED',
      'Criminal Justice': 'CJ|CRIM'
    };
    
    for (const [key, pattern] of Object.entries(programMappings)) {
      if (programName.includes(key)) {
        return `(${pattern})\\s*\\d{3,4}`;
      }
    }
    
    return '[A-Z]{2,4}\\s*\\d{3,4}';
  }

  // Parse course information from search results
  parseCourses(results, limit) {
    const courses = [];
    const seen = new Set();
    
    for (const result of results) {
      const courseMatch = result.content.match(/([A-Z]{2,4})\s*(\d{3,4})\s*[-–]\s*(.+?)(\(\d+\s*cr)/);
      
      if (courseMatch && !seen.has(courseMatch[1] + courseMatch[2])) {
        seen.add(courseMatch[1] + courseMatch[2]);
        courses.push({
          code: `${courseMatch[1]} ${courseMatch[2]}`,
          title: courseMatch[3].trim(),
          description: this.extractCourseDescription(result.context),
          credits: this.extractCredits(courseMatch[4])
        });
        
        if (courses.length >= limit) break;
      }
    }
    
    return courses;
  }

  // Extract course description from context
  extractCourseDescription(context) {
    if (!context || context.length === 0) return '';
    
    // Join context lines and clean up
    const fullText = context.join(' ');
    const cleaned = fullText.replace(/\s+/g, ' ').trim();
    
    // Return first 150 characters
    return cleaned.substring(0, 150) + (cleaned.length > 150 ? '...' : '');
  }

  // Extract credit hours
  extractCredits(creditText) {
    const match = creditText.match(/(\d+)\s*cr/);
    return match ? parseInt(match[1]) : 3;
  }

  // Get recommended programs based on student profile
  async getRecommendedPrograms(profile) {
    const { educationLevel, interests, experience } = profile;
    const recommendations = [];
    
    // Determine appropriate program level
    const programTypes = this.determineProgramTypes(educationLevel);
    
    // Search for programs matching interests and experience
    for (const interest of interests) {
      const programs = await this.searchPrograms(interest, { 
        programType: programTypes[0],
        limit: 5 
      });
      
      recommendations.push(...programs);
    }
    
    // Remove duplicates and limit to top 3
    const unique = Array.from(new Map(recommendations.map(p => [p.name, p])).values());
    return unique.slice(0, 3);
  }

  // Determine appropriate program types based on education level
  determineProgramTypes(educationLevel) {
    const levelMap = {
      'high school': ['undergraduate', 'associate'],
      'associate': ['undergraduate'],
      'bachelor': ['graduate'],
      'master': ['graduate', 'doctoral'],
      'doctoral': ['doctoral']
    };
    
    return levelMap[educationLevel.toLowerCase()] || ['undergraduate'];
  }

  // Get Salem University features for career assessment
  getSalemFeatures() {
    return {
      heritage: "130 years of educational excellence since 1888",
      graduates: "Over 20,000 successful graduates",
      support: "Weekly free tutoring sessions",
      tutoring: "Free professional tutoring through Tutor.com (5 hours per course)",
      library: "24/7 online library and writing center access",
      accreditation: "HLC accredited since 1963",
      businessAccreditation: "ACBSP accredited School of Business",
      educationAccreditation: "CAEP accredited School of Education"
    };
  }
}

// Export for use in quiz application
module.exports = CatalogService;

// Example usage:
/*
const catalogService = new CatalogService();

// Search for business programs
const businessPrograms = await catalogService.searchPrograms('Business Administration', {
  programType: 'undergraduate',
  limit: 5
});

// Get specific program details
const programDetails = await catalogService.getProgramDetails('Bachelor of Science in Business Administration');

// Get course examples
const courses = await catalogService.getCourseExamples('Business Administration', 3);

// Get recommendations based on profile
const recommendations = await catalogService.getRecommendedPrograms({
  educationLevel: 'bachelor',
  interests: ['business', 'technology'],
  experience: ['management', 'sales']
});
*/